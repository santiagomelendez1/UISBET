const express = require("express");
const router = express.Router();
const { usuarios, verificarUsuario } = require("../middleware/authMiddleware");

// ---->> 6. sexto: Rutas (todo lo que tenga /api/auth va a ser manejado por authRoutes)----------------
// endpoint para registrar un nuevo usuario
router.post("/register", (req, res) => {
  // Extraemos el nombre, email y password del cuerpo de la solicitud
  const { nombre, email, password } = req.body; // Extraemos el nombre, email y password del cuerpo de la solicitud

  //-------------------------------------------------------------------------------

  //---->> 7. SEPTIMO: Lógica de registro (verificar si el usuario ya existe )----------------
  // Verificamos si el usuario ya existe en el array de usuarios registrados
  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    res.status(400).json({ message: "El usuario ya existe" }); // Si el usuario ya existe, respondemos con un error
  } else {
    usuarios.push({ nombre, email, password }); // Agrega el nuevo usuario al array en memoria
    console.log("Usuarios registrados:", usuarios);
    res.status(201).json({ message: "Usuario registrado correctamente" }); // Responde con un mensaje de éxito si el registro fue exitoso
  }
  //--------------------------------------------------------------------------------
});

//------>> 7.SEPTIMO(login): ocurre cuanod la validacion de usuario es correcta---
//endpoint para iniciar sesión,
router.post("/login", verificarUsuario, (req, res) => {
  // Si el middleware verifica que el usuario existe y la contraseña es correcta, llegamos aquí
  res
    .status(200)
    .json({ message: `Bienvenido ${req.usuarioAutenticado.email}` });
});
//--------------------------------------------------------------------------------
module.exports = router;
