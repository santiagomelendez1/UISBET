import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { validateEmail } from '../middleware/validateEmail.js';
import { authRequired } from '../middleware/authMiddleware.js';

/* Crea el enrutador para autenticación. */
const router = express.Router();

/* Clave secreta para firmar y validar tokens. */
const JWT_SECRET = process.env.JWT_SECRET || 'uisbet_secret_clase';

/* Registro de usuarios. */
router.post('/register', validateEmail, async (req, res) => {
  try {
    /* Obtiene los datos enviados desde el frontend. */
    const { name, email, password } = req.body;

    /* Verifica que todos los campos obligatorios existan. */
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    /* Revisa si el correo ya está registrado. */
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    /* Encripta la contraseña antes de guardarla. */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* Inserta el nuevo usuario con rol normal. */
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    /* Responde con mensaje de éxito e id creado. */
    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      userId: result.insertId,
    });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al registrar usuario.', error: error.message });
  }
});

/* Login de usuarios. */
router.post('/login', validateEmail, async (req, res) => {
  try {
    /* Obtiene correo y contraseña enviados. */
    const { email, password } = req.body;

    /* Verifica que ambos campos existan. */
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    /* Busca el usuario por correo. */
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    /* Si no existe el usuario, niega el acceso. */
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    /* Compara la contraseña enviada con la encriptada en BD. */
    const validPassword = await bcrypt.compare(password, user.password);

    /* Si la contraseña no coincide, niega el acceso. */
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    /* Genera el token con los datos principales del usuario. */
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    /* Devuelve el token y la información básica del usuario. */
    return res.json({
      message: 'Login exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance ?? 0,
      },
    });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al iniciar sesión.', error: error.message });
  }
});

/* Consulta el usuario autenticado actual. */
router.get('/me', authRequired, async (req, res) => {
  try {
    /* Busca el usuario según el id guardado en el token. */
    const [rows] = await pool.query(
      'SELECT id, name, email, role, balance, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    /* Devuelve los datos del usuario actual. */
    return res.json(rows[0]);
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al consultar usuario.', error: error.message });
  }
});

/* Actualiza el saldo del usuario autenticado. */
router.patch('/balance', authRequired, async (req, res) => {
  try {
    /* Obtiene el nuevo saldo enviado. */
    const { balance } = req.body;

    /* Verifica que el saldo sea válido. */
    if (balance === undefined || balance === null || balance < 0) {
      return res.status(400).json({ message: 'Saldo inválido.' });
    }

    /* Actualiza el saldo del usuario actual en la BD. */
    await pool.query('UPDATE users SET balance = ? WHERE id = ?', [balance, req.user.id]);

    /* Responde con confirmación del nuevo saldo. */
    return res.json({ message: 'Saldo actualizado.', balance });
  } catch (error) {
    /* Si ocurre un error, responde con estado 500. */
    return res.status(500).json({ message: 'Error al actualizar saldo.', error: error.message });
  }
});

export default router;