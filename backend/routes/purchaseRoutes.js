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

/* Registra compra y acredita fichas si el pago está confirmado. */
router.post('/', authRequired, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { package_id, payment_reference, status = 'pagada' } = req.body;

    const [pkgs] = await connection.query(
      'SELECT chips FROM chip_packages WHERE id = ?',
      [package_id]
    );
    if (pkgs.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Paquete no encontrado.' });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      'INSERT INTO purchases (user_id, package_id, payment_reference, status) VALUES (?, ?, ?, ?)',
      [req.user.id, package_id, payment_reference || null, status]
    );

    if (status === 'pagada') {
      await connection.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [pkgs[0].chips, req.user.id]
      );
    }

    await connection.commit();
    return res.status(201).json({ message: 'Compra registrada.', id: result.insertId });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: 'Error al registrar compra.', error: error.message });
  } finally {
    connection.release();
  }
});

/* Actualiza compra y recalcula balance según cambio de estado/paquete. */
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { package_id, payment_reference, status } = req.body;

    /* Compra actual para saber el estado/paquete previo. */
    const [rows] = await connection.query(
      'SELECT p.user_id, p.status AS old_status, p.package_id AS old_pkg_id, cp.chips AS old_chips FROM purchases p INNER JOIN chip_packages cp ON cp.id = p.package_id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Compra no encontrada.' });
    }

    const { user_id, old_status, old_pkg_id, old_chips } = rows[0];

    const [newPkgs] = await connection.query(
      'SELECT chips FROM chip_packages WHERE id = ?',
      [package_id]
    );
    if (newPkgs.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Paquete no encontrado.' });
    }
    const new_chips = newPkgs[0].chips;

    /* Calcula el delta de balance según los estados anterior y nuevo. */
    let delta = 0;
    if (old_status === 'pagada' && status === 'pagada') {
      delta = new_chips - old_chips;           // cambio de paquete sin cambiar estado
    } else if (old_status === 'pagada' && status !== 'pagada') {
      delta = -old_chips;                      // se cancela/pone pendiente → devuelve fichas negativas
    } else if (old_status !== 'pagada' && status === 'pagada') {
      delta = new_chips;                       // se confirma pago → acredita fichas
    }

    await connection.beginTransaction();

    await connection.query(
      'UPDATE purchases SET package_id = ?, payment_reference = ?, status = ? WHERE id = ?',
      [package_id, payment_reference || null, status, req.params.id]
    );

    if (delta !== 0) {
      await connection.query(
        'UPDATE users SET balance = GREATEST(0, balance + ?) WHERE id = ?',
        [delta, user_id]
      );
    }

    await connection.commit();
    return res.json({ message: 'Compra actualizada.' });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ message: 'Error al actualizar compra.', error: error.message });
  } finally {
    connection.release();
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