import jwt from 'jsonwebtoken';

/* Clave secreta para validar el token JWT. */
const JWT_SECRET = process.env.JWT_SECRET || 'uisbet_secret_clase';

/* Verifica si el usuario envió un token válido. */
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  /* Si no hay token o el formato es incorrecto, bloquea el acceso. */
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no enviado.' });
  }

  /* Extrae el token del header. */
  const token = authHeader.split(' ')[1];

  try {
    /* Valida el token y guarda los datos del usuario. */
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    /* Si el token falla, niega el acceso. */
    return res.status(401).json({ message: 'Token inválido o vencido.' });
  }
}

/* Verifica si el usuario autenticado es administrador. */
export function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administrador.' });
  }

  next();
}