import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { authRequired, adminRequired } from '../middleware/authMiddleware.js';
import { validateEmail } from '../middleware/validateEmail.js';

/* Crea el enrutador para usuarios. */
const router = express.Router();

/* Lista todos los usuarios. */
router.get('/', authRequired, adminRequired, async (_req, res) => {
  try {
    /* Consulta los usuarios ordenados del más reciente al más antiguo. */
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
    );

    /* Devuelve la lista de usuarios. */
    return res.json(rows);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al listar usuarios.', error: error.message });
  }
});

/* Consulta un usuario por id. */
router.get('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    /* Busca el usuario según el id recibido en la ruta. */
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    /* Devuelve el usuario encontrado o null si no existe. */
    return res.json(rows[0] || null);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al consultar usuario.', error: error.message });
  }
});

/* Crea un nuevo usuario. */
router.post('/', authRequired, adminRequired, validateEmail, async (req, res) => {
  try {
    /* Obtiene los datos enviados. */
    const { name, email, password, role = 'user' } = req.body;

    /* Verifica que los campos obligatorios existan. */
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
    }

    /* Encripta la contraseña antes de guardarla. */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* Inserta el nuevo usuario en la base de datos. */
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    /* Devuelve mensaje de éxito e id del nuevo usuario. */
    return res.status(201).json({ message: 'Usuario creado.', id: result.insertId });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al crear usuario.', error: error.message });
  }
});

/* Actualiza un usuario existente. */
router.put('/:id', authRequired, adminRequired, validateEmail, async (req, res) => {
  try {
    /* Obtiene los nuevos datos enviados. */
    const { name, email, role } = req.body;

    /* Actualiza el usuario según su id. */
    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name, email, role || 'user', req.params.id]
    );

    /* Devuelve mensaje de actualización exitosa. */
    return res.json({ message: 'Usuario actualizado.' });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al actualizar usuario.', error: error.message });
  }
});

/* Elimina un usuario por id. */
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    /* Elimina el usuario indicado. */
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);

    /* Devuelve mensaje de eliminación exitosa. */
    return res.json({ message: 'Usuario eliminado.' });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al eliminar usuario.', error: error.message });
  }
});

export default router;