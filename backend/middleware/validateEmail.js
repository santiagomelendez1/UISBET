/* Valida que el correo exista y tenga un formato correcto. */
export function validateEmail(req, res, next) {
  /* Obtiene el correo enviado en el body y elimina espacios. */
  const email = req.body.email?.trim();

  /* Expresión regular para validar el formato del correo. */
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Si el correo no existe o no cumple el formato, bloquea la petición. */
  if (!email || !regex.test(email)) {
    return res.status(400).json({ message: 'Correo electrónico inválido.' });
  }

  /* Si el correo es válido, continúa con la siguiente función. */
  next();
}