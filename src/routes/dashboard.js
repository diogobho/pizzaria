import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireOwner } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics (Owner only)
router.get('/stats', authenticateToken, requireOwner, async (req, res) => {
  try {
    // Total sales
    const totalSalesResult = await pool.query(
      'SELECT COALESCE(SUM(total), 0) as total_vendas FROM orders WHERE status = $1',
      ['finalizado']
    );

    // Orders today
    const todayOrdersResult = await pool.query(
      'SELECT COUNT(*) as pedidos_hoje FROM orders WHERE DATE(created_at) = CURRENT_DATE'
    );

    // Pending orders
    const pendingOrdersResult = await pool.query(
      'SELECT COUNT(*) as pedidos_pendentes FROM orders WHERE status != $1',
      ['finalizado']
    );

    // Most sold products
    const mostSoldResult = await pool.query(`
      SELECT oi.product_name as nome, SUM(oi.quantidade) as quantidade
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'finalizado'
      GROUP BY oi.product_name
      ORDER BY quantidade DESC
      LIMIT 5
    `);

    // Revenue by day (last 7 days)
    const revenueByDayResult = await pool.query(`
      SELECT DATE(created_at) as data, COALESCE(SUM(total), 0) as receita
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        AND status = 'finalizado'
      GROUP BY DATE(created_at)
      ORDER BY data DESC
    `);

    // Orders by status
    const ordersByStatusResult = await pool.query(`
      SELECT status, COUNT(*) as quantidade
      FROM orders
      GROUP BY status
    `);

    res.json({
      totalVendas: parseFloat(totalSalesResult.rows[0].total_vendas),
      pedidosHoje: parseInt(todayOrdersResult.rows[0].pedidos_hoje),
      pedidosPendentes: parseInt(pendingOrdersResult.rows[0].pedidos_pendentes),
      produtosMaisVendidos: mostSoldResult.rows.map(row => ({
        nome: row.nome,
        quantidade: parseInt(row.quantidade)
      })),
      receitaPorDia: revenueByDayResult.rows.map(row => ({
        data: row.data,
        receita: parseFloat(row.receita)
      })),
      pedidosPorStatus: ordersByStatusResult.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.quantidade);
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Get recent activity (Owner only)
router.get('/activity', authenticateToken, requireOwner, async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const result = await pool.query(`
      SELECT 
        o.id,
        o.total,
        o.status,
        o.created_at,
        u.nome as user_name,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.nome
      ORDER BY o.created_at DESC
      LIMIT $1
    `, [limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({ error: 'Erro ao buscar atividade recente' });
  }
});

export default router;