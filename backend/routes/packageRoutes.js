import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, adminRequired } from '../middleware/authMiddleware.js';

/* Crea el enrutador para paquetes de fichas. */
const router = express.Router();

/* Lista todos los paquetes disponibles. */
router.get('/', async (_req, res) => {
  try {
    /* Consulta los paquetes ordenados por cantidad de fichas. */
    const [rows] = await pool.query('SELECT * FROM chip_packages ORDER BY chips ASC');

    /* Devuelve la lista de paquetes. */
    return res.json(rows);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al listar paquetes.', error: error.message });
  }
});

/* Crea un nuevo paquete. */
router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    /* Obtiene los datos enviados. */
    const { name, chips, price, description } = req.body;

    /* Inserta el nuevo paquete en la base de datos. */
    const [result] = await pool.query(
      'INSERT INTO chip_packages (name, chips, price, description) VALUES (?, ?, ?, ?)',
      [name, chips, price, description || null]
    );

    /* Responde con mensaje de éxito e id creado. */
    return res.status(201).json({ message: 'Paquete creado.', id: result.insertId });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al crear paquete.', error: error.message });
  }
});

/* Actualiza un paquete existente. */
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    /* Obtiene los nuevos datos enviados. */
    const { name, chips, price, description } = req.body;

    /* Actualiza el paquete según su id. */
    await pool.query(
      'UPDATE chip_packages SET name = ?, chips = ?, price = ?, description = ? WHERE id = ?',
      [name, chips, price, description || null, req.params.id]
    );

    /* Responde con mensaje de actualización exitosa. */
    return res.json({ message: 'Paquete actualizado.' });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al actualizar paquete.', error: error.message });
  }
});

/* Elimina un paquete por id. */
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    /* Elimina el paquete indicado. */
    await pool.query('DELETE FROM chip_packages WHERE id = ?', [req.params.id]);

    /* Responde con mensaje de eliminación exitosa. */
    return res.json({ message: 'Paquete eliminado.' });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al eliminar paquete.', error: error.message });
  }
});

export default router;