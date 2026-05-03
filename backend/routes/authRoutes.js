const express = require("express");
const router = express.Router();
const { usuarios, verificarUsuario } = require("../middleware/authMiddleware");

// ── Registro ──────────────────────────────────────
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    res.send("El usuario ya existe");
  } else {
    usuarios.push({ email, password });
    console.log("Usuarios registrados:", usuarios);
    res.send("Usuario registrado correctamente");
  }
});

// ── Login — usa el middleware para verificar antes de entrar ──
router.post("/login", verificarUsuario, (req, res) => {
  res.send(
    `El usuario ${req.usuarioAutenticado.email} se ha autenticado correctamente`,
  );
});

module.exports = router;
