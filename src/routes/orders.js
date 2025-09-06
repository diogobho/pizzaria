import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import { authenticateToken, requireOwner, requireAny } from '../middleware/auth.js';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Get user orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantidade', oi.quantidade,
                 'preco_unit', oi.preco_unit,
                 'observacao', oi.observacao
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Get all orders (Owner only)
router.get('/', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = `
      SELECT o.*, u.nome as user_name, u.email as user_email,
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'product_name', oi.product_name,
                 'quantidade', oi.quantidade,
                 'preco_unit', oi.preco_unit,
                 'observacao', oi.observacao
               )
             ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    
    let params = [];
    
    if (status && status !== 'all') {
      query += ' WHERE o.status = $1';
      params.push(status);
    }
    
    query += ' GROUP BY o.id, u.nome, u.email ORDER BY o.created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Create order
router.post('/', authenticateToken, [
  body('items').isArray({ min: 1 }).withMessage('Pedido deve ter pelo menos 1 item'),
  body('items.*.product_id').notEmpty().withMessage('ID do produto inválido'),
  body('items.*.quantidade').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que 0'),
  body('observacao').optional().trim()
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, observacao, cliente_nome, cliente_telefone, cliente_endereco } = req.body;
    const userId = req.user.id;

    // Validate products and calculate total
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const productResult = await client.query(
        'SELECT id, nome, preco, estoque FROM products WHERE id = $1',
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Produto ${item.product_id} não encontrado` });
      }

      const product = productResult.rows[0];

      if (product.estoque < item.quantidade) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Estoque insuficiente para ${product.nome}` });
      }

      validatedItems.push({
        ...item,
        product_name: product.nome,
        preco_unit: product.preco
      });

      total += product.preco * item.quantidade;

      // Update stock
      await client.query(
        'UPDATE products SET estoque = estoque - $1 WHERE id = $2',
        [item.quantidade, item.product_id]
      );
    }

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total, observacao, status, cliente_nome, cliente_telefone, cliente_endereco) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, total, observacao, 'nao_iniciado', cliente_nome, cliente_telefone, cliente_endereco]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of validatedItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantidade, preco_unit, observacao) VALUES ($1, $2, $3, $4, $5, $6)',
        [order.id, item.product_id, item.product_name, item.quantidade, item.preco_unit, item.observacao]
      );
    }

    await client.query('COMMIT');

    // Clear user's cart from Redis
    await redisClient.del(`cart:${userId}`);

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order: {
        ...order,
        items: validatedItems
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  } finally {
    client.release();
  }
});

// Update order status (Owner only)
router.patch('/:id/status', authenticateToken, requireOwner, [
  body('status').isIn(['nao_iniciado', 'em_andamento', 'finalizado']).withMessage('Status inválido'),
  body('entregador').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, entregador } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1, entregador = $2 WHERE id = $3 RETURNING *',
      [status, entregador, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json({
      message: 'Status do pedido atualizado com sucesso',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
  }
});

// Generate PDF invoice (Owner only)
router.get('/:id/pdf', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // Get order with items
    const result = await pool.query(`
      SELECT o.*, u.nome as user_name, u.email as user_email,
             json_agg(
               json_build_object(
                 'product_name', oi.product_name,
                 'quantidade', oi.quantidade,
                 'preco_unit', oi.preco_unit,
                 'observacao', oi.observacao
               )
             ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id, u.nome, u.email
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const order = result.rows[0];

    // Create PDF
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=pedido-${id}.pdf`);
    
    doc.pipe(res);

    // PDF Header
    doc.fontSize(20).text('Rodrigo\'s Delivery', 50, 50);
    doc.fontSize(12).text('Pizza Artesanal com Sabor Único', 50, 75);
    doc.text('Telefone: (11) 99999-9999', 50, 90);
    
    // Order info
    doc.fontSize(16).text(`Pedido #${id.slice(-6).toUpperCase()}`, 50, 130);
    doc.fontSize(12).text(`Cliente: ${order.user_name}`, 50, 155);
    doc.text(`Email: ${order.user_email}`, 50, 170);
    doc.text(`Data: ${new Date(order.created_at).toLocaleString('pt-BR')}`, 50, 185);
    doc.text(`Status: ${order.status}`, 50, 200);
    
    if (order.entregador) {
      doc.text(`Entregador: ${order.entregador}`, 50, 215);
    }

    // Items
    doc.fontSize(14).text('Itens do Pedido:', 50, 250);
    
    let yPosition = 275;
    order.items.forEach((item, index) => {
      const itemTotal = item.quantidade * item.preco_unit;
      doc.fontSize(10)
         .text(`${item.quantidade}x ${item.product_name}`, 50, yPosition)
         .text(`R$ ${item.preco_unit.toFixed(2)}`, 300, yPosition)
         .text(`R$ ${itemTotal.toFixed(2)}`, 400, yPosition);
      
      if (item.observacao) {
        yPosition += 15;
        doc.fontSize(8).text(`Obs: ${item.observacao}`, 70, yPosition);
      }
      
      yPosition += 20;
    });

    // Total
    doc.fontSize(14).text(`Total: R$ ${order.total.toFixed(2)}`, 50, yPosition + 20);
    
    if (order.observacao) {
      doc.fontSize(12).text(`Observações: ${order.observacao}`, 50, yPosition + 50);
    }

    doc.end();
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ error: 'Erro ao gerar PDF' });
  }
});

export default router;// Adicionar ao final do arquivo de rotas orders.js
router.get('/:id/nota', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT o.*, u.nome as user_name, u.email as user_email,
             json_agg(
               json_build_object(
                 'product_name', oi.product_name,
                 'quantidade', oi.quantidade,
                 'preco_unit', oi.preco_unit,
                 'observacao', oi.observacao
               )
             ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1
      GROUP BY o.id, u.nome, u.email
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const order = result.rows[0];
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nota Fiscal - Pedido #${id.slice(-6).toUpperCase()}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .items { margin: 20px 0; }
        .item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        @media print { button { display: none; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rodrigo's Delivery</h1>
        <p>Pizza Artesanal com Sabor Único</p>
        <p>Telefone: (11) 99999-9999</p>
    </div>
    
    <div class="info">
        <div>
            <h3>Pedido #${id.slice(-6).toUpperCase()}</h3>
            <p>Data: ${new Date(order.created_at).toLocaleString('pt-BR')}</p>
            <p>Status: ${order.status}</p>
        </div>
        <div>
            <h3>Cliente</h3>
            <p>Nome: ${order.user_name}</p>
            <p>Email: ${order.user_email}</p>
        </div>
    </div>
    
    <div class="items">
        <h3>Itens do Pedido</h3>
        ${order.items.map(item => `
            <div class="item">
                <span>${item.quantidade}x ${item.product_name}</span>
                <span>R$ ${(item.quantidade * item.preco_unit).toFixed(2)}</span>
            </div>
            ${item.observacao ? `<div style="font-size: 12px; color: #666; margin-left: 20px;">Obs: ${item.observacao}</div>` : ''}
        `).join('')}
    </div>
    
    <div class="total">
        Total: R$ ${order.total.toFixed(2)}
    </div>
    
    ${order.observacao ? `<div><strong>Observações:</strong> ${order.observacao}</div>` : ''}
    
    <div style="margin-top: 30px; text-align: center;">
        <button onclick="window.print()">Imprimir</button>
        <button onclick="window.close()">Fechar</button>
    </div>
</body>
</html>`;
    
    res.send(html);
  } catch (error) {
    console.error('Generate nota fiscal error:', error);
    res.status(500).json({ error: 'Erro ao gerar nota fiscal' });
  }
});
