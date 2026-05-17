import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, adminRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

/* Lista paquetes. */
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM chip_packages ORDER BY chips ASC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar paquetes.', error: error.message });
  }
});

/* Crea paquete. */
router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    const { name, chips, price, description } = req.body;

    const [result] = await pool.query(
      'INSERT INTO chip_packages (name, chips, price, description) VALUES (?, ?, ?, ?)',
      [name, chips, price, description || null]
    );

    return res.status(201).json({ message: 'Paquete creado.', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear paquete.', error: error.message });
  }
});

/* Actualiza paquete. */
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const { name, chips, price, description } = req.body;

    await pool.query(
      'UPDATE chip_packages SET name = ?, chips = ?, price = ?, description = ? WHERE id = ?',
      [name, chips, price, description || null, req.params.id]
    );

    return res.json({ message: 'Paquete actualizado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar paquete.', error: error.message });
  }
});

/* Elimina paquete. */
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM chip_packages WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Paquete eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar paquete.', error: error.message });
  }
});

export default router;