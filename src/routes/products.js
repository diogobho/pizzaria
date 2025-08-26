import express from 'express';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database.js';
import { authenticateToken, requireOwner } from '../middleware/auth.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = 'SELECT * FROM products WHERE estoque > 0 ORDER BY categoria, nome';
    let params = [];
    
    if (categoria && categoria !== 'all') {
      query = 'SELECT * FROM products WHERE categoria = $1 AND estoque > 0 ORDER BY nome';
      params = [categoria];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Create product (Owner only)
router.post('/', authenticateToken, requireOwner, [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('categoria').isIn(['tradicional', 'premium', 'especial', 'refrigerantes']).withMessage('Categoria inválida'),
  body('descricao').trim().isLength({ min: 5 }).withMessage('Descrição deve ter pelo menos 5 caracteres'),
  body('preco').isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que 0'),
  body('estoque').isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro não negativo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, categoria, descricao, preco, estoque, imagem } = req.body;

    const result = await pool.query(
      'INSERT INTO products (nome, categoria, descricao, preco, estoque, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, categoria, descricao, preco, estoque, imagem]
    );

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// Update product (Owner only)
router.put('/:id', authenticateToken, requireOwner, [
  body('nome').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('categoria').optional().isIn(['tradicional', 'premium', 'especial', 'refrigerantes']).withMessage('Categoria inválida'),
  body('descricao').optional().trim().isLength({ min: 5 }).withMessage('Descrição deve ter pelo menos 5 caracteres'),
  body('preco').optional().isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que 0'),
  body('estoque').optional().isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro não negativo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updates = req.body;

    // Check if product exists
    const existingProduct = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const result = await pool.query(
      `UPDATE products SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    res.json({
      message: 'Produto atualizado com sucesso',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// Delete product (Owner only)
router.delete('/:id', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  }
});

export default router;