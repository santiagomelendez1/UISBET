const express = require("express");
const router = express.Router();
const { usuarios, verificarUsuario } = require("../middleware/authMiddleware"); // ← importa ambos

// ── Registro ──────────────────────────────────────
router.post("/register", (req, res) => {
  const { nombre, email, password } = req.body;

  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    res.status(400).json({ message: "El usuario ya existe" });
  } else {
    usuarios.push({ nombre, email, password });
    console.log("Usuarios registrados:", usuarios);
    res.status(201).json({ message: "Usuario registrado correctamente" });
  }
});

// ── Login ─────────────────────────────────────────
router.post("/login", verificarUsuario, (req, res) => {
  res
    .status(200)
    .json({ message: `Bienvenido ${req.usuarioAutenticado.email}` });
});

module.exports = router;
