// Usuarios registrados (simulando una BD en memoria)
const usuarios = [];

// Middleware que verifica si el usuario existe antes de hacer login
const verificarUsuario = (req, res, next) => {
  const { email, password } = req.body;

  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    res.send("Usuario no autenticado");
  } else if (usuario.password !== password) {
    res.send("Contraseña incorrecta");
  } else {
    req.usuarioAutenticado = usuario; // lo pasamos a la siguiente función
    next();
  }
};

module.exports = { usuarios, verificarUsuario };
