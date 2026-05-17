import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'uisbet_secret_clase';

/* Verifica token. */
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no enviado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o vencido.' });
  }
}

/* Verifica rol administrador. */
export function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administrador.' });
  }

  next();
}