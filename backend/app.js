const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5000;

// ── Middlewares globales ──────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Middleware logger
app.use((req, res, next) => {
  console.log(
    `mensaje desde el middleware: ruta ${req.url} método: ${req.method}`,
  );
  next();
});

// ── Rutas ─────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Iniciar servidor ──────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor casino corriendo en http://localhost:${PORT}`);
});
