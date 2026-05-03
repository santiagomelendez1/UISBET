// ── Array en memoria que guarda los usuarios registrados ──
const usuarios = []; // ← debe estar AQUÍ

// Middleware que verifica si el usuario existe antes de hacer login
const verificarUsuario = (req, res, next) => {
  const { email, password } = req.body;

  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    res.status(404).json({ message: "Usuario no encontrado" });
  } else if (usuario.password !== password) {
    res.status(401).json({ message: "Contraseña incorrecta" });
  } else {
    req.usuarioAutenticado = usuario;
    next();
  }
};

module.exports = { usuarios, verificarUsuario }; // ← exporta ambos
