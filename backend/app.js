const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5000;

// ── Middlewares globales ──────────────────────────
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
// --->> 4. CUARTO(LOGIN)---------------------------------------------------------
//---->> 5 QUINTO: Middleware (antes de llegar a la ruta pasa por este middleware)-----------
app.use((req, res, next) => {
  //req (Request): Es el paquete que viene del frontend
  //res (Response): Es lo que el servidor tiene en la mano para responder.
  //next: Es el permiso de salida, para que el usuario no vea su pantalla cargando por siempre.
  console.log(
    `mensaje desde el middleware: ruta ${req.url} método: ${req.method}`,
  );
  next(); // Le damos permiso para que siga a la ruta.
});
//--------------------------------------------------------------------------------

//---->> 6, SEXTO: Rutas (todo lo que tenga /api/auth va a ser manejado por authRoutes)----------------
// ── Rutas ─────────────────────────────────────────
app.use("/api/auth", authRoutes);
//--------------------------------------------------------------------------------

// ── Iniciar servidor ──────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor casino corriendo en http://localhost:${PORT}`);
});
