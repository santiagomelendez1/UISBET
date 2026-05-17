/* Valida correos con expresión regular. */
export function validateEmail(req, res, next) {
  const email = req.body.email?.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !regex.test(email)) {
    return res.status(400).json({ message: 'Correo electrónico inválido.' });
  }

  next();
}