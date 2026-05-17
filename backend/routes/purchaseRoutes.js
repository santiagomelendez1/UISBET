import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, adminRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

/* Lista compras para admin. */
router.get('/', authRequired, adminRequired, async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.user_id, u.name AS user_name, u.email,
             p.package_id, cp.name AS package_name, cp.chips, cp.price,
             p.payment_reference, p.status, p.created_at
      FROM purchases p
      INNER JOIN users u ON u.id = p.user_id
      INNER JOIN chip_packages cp ON cp.id = p.package_id
      ORDER BY p.id DESC
    `);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar compras.', error: error.message });
  }
});

/* Lista compras del usuario actual. */
router.get('/mine', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.package_id, cp.name AS package_name, cp.chips, cp.price,
             p.payment_reference, p.status, p.created_at
      FROM purchases p
      INNER JOIN chip_packages cp ON cp.id = p.package_id
      WHERE p.user_id = ?
      ORDER BY p.id DESC
    `, [req.user.id]);

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar compras del usuario.', error: error.message });
  }
});

/* Estadísticas del usuario actual. */
router.get('/stats/mine', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT COALESCE(SUM(cp.chips), 0) AS total_chips,
             COUNT(p.id) AS total_purchases,
             SUM(CASE WHEN p.status = 'pagada' THEN 1 ELSE 0 END) AS paid_count
      FROM purchases p
      INNER JOIN chip_packages cp ON cp.id = p.package_id
      WHERE p.user_id = ?
    `, [req.user.id]);

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error al cargar estadísticas.', error: error.message });
  }
});

/* Registra compra. */
router.post('/', authRequired, async (req, res) => {
  try {
    const { package_id, payment_reference, status = 'pagada' } = req.body;

    const [result] = await pool.query(
      'INSERT INTO purchases (user_id, package_id, payment_reference, status) VALUES (?, ?, ?, ?)',
      [req.user.id, package_id, payment_reference || null, status]
    );

    return res.status(201).json({ message: 'Compra registrada.', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar compra.', error: error.message });
  }
});

/* Actualiza compra. */
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const { package_id, payment_reference, status } = req.body;

    await pool.query(
      'UPDATE purchases SET package_id = ?, payment_reference = ?, status = ? WHERE id = ?',
      [package_id, payment_reference || null, status, req.params.id]
    );

    return res.json({ message: 'Compra actualizada.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar compra.', error: error.message });
  }
});

/* Elimina compra. */
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM purchases WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Compra eliminada.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar compra.', error: error.message });
  }
});

export default router;