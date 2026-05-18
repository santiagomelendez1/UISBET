import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, adminRequired } from '../middleware/authMiddleware.js';

/* Crea el enrutador para las compras. */
const router = express.Router();

/* Lista todas las compras para el administrador. */
router.get('/', authRequired, adminRequired, async (_req, res) => {
  try {
    /* Consulta compras con datos del usuario y del paquete. */
    const [rows] = await pool.query(`
      SELECT p.id, p.user_id, u.name AS user_name, u.email,
             p.package_id, cp.name AS package_name, cp.chips, cp.price,
             p.payment_reference, p.status, p.created_at
      FROM purchases p
      INNER JOIN users u ON u.id = p.user_id
      INNER JOIN chip_packages cp ON cp.id = p.package_id
      ORDER BY p.id DESC
    `);

    /* Devuelve la lista completa de compras. */
    return res.json(rows);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al listar compras.', error: error.message });
  }
});

/* Lista las compras del usuario autenticado. */
router.get('/mine', authRequired, async (req, res) => {
  try {
    /* Consulta solo las compras del usuario actual. */
    const [rows] = await pool.query(`
      SELECT p.id, p.package_id, cp.name AS package_name, cp.chips, cp.price,
             p.payment_reference, p.status, p.created_at
      FROM purchases p
      INNER JOIN chip_packages cp ON cp.id = p.package_id
      WHERE p.user_id = ?
      ORDER BY p.id DESC
    `, [req.user.id]);

    /* Devuelve las compras del usuario. */
    return res.json(rows);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al listar compras del usuario.', error: error.message });
  }
});

/* Muestra estadísticas del usuario actual. */
router.get('/stats/mine', authRequired, async (req, res) => {
  try {
    /* Calcula fichas compradas, total de compras y compras pagadas. */
    const [rows] = await pool.query(`
      SELECT COALESCE(SUM(cp.chips), 0) AS total_chips,
             COUNT(p.id) AS total_purchases,
             SUM(CASE WHEN p.status = 'pagada' THEN 1 ELSE 0 END) AS paid_count
      FROM purchases p
      INNER JOIN chip_packages cp ON cp.id = p.package_id
      WHERE p.user_id = ?
    `, [req.user.id]);

    /* Devuelve las estadísticas del usuario. */
    return res.json(rows[0]);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al cargar estadísticas.', error: error.message });
  }
});

/* Registra una compra y suma fichas si está pagada. */
router.post('/', authRequired, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    /* Obtiene los datos de la compra. */
    const { package_id, payment_reference, status = 'pagada' } = req.body;

    /* Busca cuántas fichas trae el paquete. */
    const [pkgs] = await connection.query(
      'SELECT chips FROM chip_packages WHERE id = ?',
      [package_id]
    );

    /* Si el paquete no existe, devuelve error. */
    if (pkgs.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Paquete no encontrado.' });
    }

    /* Inicia una transacción para registrar compra y actualizar saldo. */
    await connection.beginTransaction();

    /* Inserta la compra en la tabla purchases. */
    const [result] = await connection.query(
      'INSERT INTO purchases (user_id, package_id, payment_reference, status) VALUES (?, ?, ?, ?)',
      [req.user.id, package_id, payment_reference || null, status]
    );

    /* Si la compra quedó pagada, suma fichas al balance del usuario. */
    if (status === 'pagada') {
      await connection.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [pkgs[0].chips, req.user.id]
      );
    }

    /* Confirma todos los cambios. */
    await connection.commit();
    return res.status(201).json({ message: 'Compra registrada.', id: result.insertId });
  } catch (error) {
    /* Si algo falla, deshace los cambios. */
    await connection.rollback();
    return res.status(500).json({ message: 'Error al registrar compra.', error: error.message });
  } finally {
    /* Libera la conexión usada en la transacción. */
    connection.release();
  }
});

/* Actualiza una compra y ajusta el saldo si cambió el estado o el paquete. */
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    /* Obtiene los nuevos datos enviados. */
    const { package_id, payment_reference, status } = req.body;

    /* Consulta la compra actual para comparar valores anteriores. */
    const [rows] = await connection.query(
      'SELECT p.user_id, p.status AS old_status, p.package_id AS old_pkg_id, cp.chips AS old_chips FROM purchases p INNER JOIN chip_packages cp ON cp.id = p.package_id WHERE p.id = ?',
      [req.params.id]
    );

    /* Si la compra no existe, devuelve error. */
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Compra no encontrada.' });
    }

    const { user_id, old_status, old_pkg_id, old_chips } = rows[0];

    /* Consulta el nuevo paquete seleccionado. */
    const [newPkgs] = await connection.query(
      'SELECT chips FROM chip_packages WHERE id = ?',
      [package_id]
    );

    /* Si el nuevo paquete no existe, devuelve error. */
    if (newPkgs.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Paquete no encontrado.' });
    }

    const new_chips = newPkgs[0].chips;

    /* Calcula cuánto debe cambiar el saldo del usuario. */
    let delta = 0;
    if (old_status === 'pagada' && status === 'pagada') {
      delta = new_chips - old_chips;
    } else if (old_status === 'pagada' && status !== 'pagada') {
      delta = -old_chips;
    } else if (old_status !== 'pagada' && status === 'pagada') {
      delta = new_chips;
    }

    /* Inicia una transacción para actualizar compra y saldo. */
    await connection.beginTransaction();

    /* Actualiza los datos de la compra. */
    await connection.query(
      'UPDATE purchases SET package_id = ?, payment_reference = ?, status = ? WHERE id = ?',
      [package_id, payment_reference || null, status, req.params.id]
    );

    /* Si el saldo debe cambiar, actualiza el balance del usuario. */
    if (delta !== 0) {
      await connection.query(
        'UPDATE users SET balance = GREATEST(0, balance + ?) WHERE id = ?',
        [delta, user_id]
      );
    }

    /* Confirma los cambios realizados. */
    await connection.commit();
    return res.json({ message: 'Compra actualizada.' });
  } catch (error) {
    /* Si algo falla, deshace los cambios. */
    await connection.rollback();
    return res.status(500).json({ message: 'Error al actualizar compra.', error: error.message });
  } finally {
    /* Libera la conexión usada en la transacción. */
    connection.release();
  }
});

/* Elimina una compra por id. */
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    /* Elimina la compra indicada. */
    await pool.query('DELETE FROM purchases WHERE id = ?', [req.params.id]);

    /* Devuelve mensaje de éxito. */
    return res.json({ message: 'Compra eliminada.' });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al eliminar compra.', error: error.message });
  }
});

export default router;