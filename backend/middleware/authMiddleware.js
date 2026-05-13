// ── Array en memoria que guarda los usuarios registrados ──
const usuarios = []; //

//-------->> 5. QUINTO: Middleware (verificacion de email)----------------
// Middleware que verifica si el usuario existe antes de hacer login
const verificarUsuario = (req, res, next) => {
  const { email, password } = req.body; // Extraemos el email y password del cuerpo de la solicitud

  // Buscamos el usuario en el array de usuarios registrados

  const usuario = usuarios.find((u) => u.email === email);
  // Si el usuario no existe, respondemos con un error
  if (!usuario) {
    // Si el usuario no existe, respondemos con un error
    res.status(404).json({ message: "Usuario no encontrado" });
    //----------------------------------------------------------------------------
    //------->> 6. SEXTO: Lógica de login (verificar la contraseña es correcta)----------------
  } else if (usuario.password !== password) {
    res.status(401).json({ message: "Contraseña incorrecta" });
  } else {
    // Si el usuario existe y la contraseña es correcta, guardamos el usuario
    req.usuarioAutenticado = usuario;
    next();
  }
  //--------------------------------------------------------------------------------
};

module.exports = { usuarios, verificarUsuario }; // ← exporta ambos
