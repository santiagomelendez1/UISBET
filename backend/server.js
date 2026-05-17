import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, pool } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import purchaseRoutes from './routes/purchaseRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Carpeta pública de imágenes turísticas. */
app.use('/turismo', express.static(path.join(__dirname, 'public', 'bucaramanga')));

/* Ruta raíz. */
app.get('/', (_req, res) => {
  res.json({ message: 'Servidor UISBET Fase II funcionando.' });
});

/* Rutas del backend. */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/purchases', purchaseRoutes);

/* Inserta datos iniciales. */
async function seedDatabase() {
  const [adminRows] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@uisbet.com']);

  if (adminRows.length === 0) {
    const hashedPassword = await bcrypt.hash('1234', 10);

    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrador UISBET', 'admin@uisbet.com', hashedPassword, 'admin']
    );
  }

  const [packageRows] = await pool.query('SELECT id FROM chip_packages LIMIT 1');

  if (packageRows.length === 0) {
    await pool.query(`
      INSERT INTO chip_packages (name, chips, price, description) VALUES
      ('Paquete Básico', 100, 5000, 'Paquete inicial de juego'),
      ('Paquete Intermedio', 500, 20000, 'Paquete recomendado'),
      ('Paquete Premium', 1000, 35000, 'Paquete para jugadores frecuentes')
    `);
  }
}

/* Inicia servidor y BD. */
async function startServer() {
  try {
    await initializeDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el backend:', error);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
  }
}

startServer();