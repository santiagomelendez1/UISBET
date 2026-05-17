import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { authRequired, adminRequired } from '../middleware/authMiddleware.js';
import { validateEmail } from '../middleware/validateEmail.js';

const router = express.Router();

/* Lista usuarios. */
router.get('/', authRequired, adminRequired, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar usuarios.', error: error.message });
  }
});

/* Consulta un usuario. */
router.get('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    return res.json(rows[0] || null);
  } catch (error) {
    return res.status(500).json({ message: 'Error al consultar usuario.', error: error.message });
  }
});

/* Crea usuario. */
router.post('/', authRequired, adminRequired, validateEmail, async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({ message: 'Usuario creado.', id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
  }
});

/* Actualiza usuario. */
router.put('/:id', authRequired, adminRequired, validateEmail, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role || 'user', req.params.id]
    );

    return res.json({ message: 'Usuario actualizado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar usuario.', error: error.message });
  }
});

/* Elimina usuario. */
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Usuario eliminado.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario.', error: error.message });
  }
});

export default router;