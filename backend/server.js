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

/* Crea la aplicación principal de Express. */
const app = express();

/* Puerto del servidor. */
const PORT =  4000;

/* Convierte la URL del archivo actual en una ruta del sistema. */
const __filename = fileURLToPath(import.meta.url);

/* Obtiene la carpeta actual del archivo server.js. */
const __dirname = path.dirname(__filename);

/* Permite peticiones desde otros orígenes, como el frontend. */
app.use(cors());

/* Permite recibir datos JSON en el body. */
app.use(express.json());

/* Permite recibir datos de formularios. */
app.use(express.urlencoded({ extended: true }));

/* Expone la carpeta pública con imágenes turísticas. */
app.use('/turismo', express.static(path.join(__dirname, 'public', 'bucaramanga')));

/* Ruta raíz para probar que el backend está funcionando. */
app.get('/', (_req, res) => {
  res.json({ message: 'Servidor UISBET Fase II funcionando.' });
});

/* Rutas principales del backend. */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/purchases', purchaseRoutes);

/* Inserta datos iniciales en la base de datos. */
async function seedDatabase() {
  /* Revisa si ya existe el usuario admin. */
  const [adminRows] = await pool.query('SELECT id FROM users WHERE email = ?', ['admin@uisbet.com']);

  if (adminRows.length === 0) {
    /* Encripta la contraseña del administrador. */
    const hashedPassword = await bcrypt.hash('1234', 10);

    /* Inserta el usuario administrador por defecto. */
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrador UISBET', 'admin@uisbet.com', hashedPassword, 'admin']
    );
  }

  /* Revisa si ya existen paquetes de fichas. */
  const [packageRows] = await pool.query('SELECT id FROM chip_packages LIMIT 1');

  if (packageRows.length === 0) {
    /* Inserta paquetes iniciales por defecto. */
    await pool.query(`
      INSERT INTO chip_packages (name, chips, price, description) VALUES
      ('Paquete Básico', 100, 5000, 'Paquete inicial de juego'),
      ('Paquete Intermedio', 500, 20000, 'Paquete recomendado'),
      ('Paquete Premium', 1000, 35000, 'Paquete para jugadores frecuentes')
    `);
  }
}

/* Inicializa la base de datos y luego arranca el servidor. */
async function startServer() {
  try {
    /* Crea la base y las tablas si no existen. */
    await initializeDatabase();

    /* Inserta datos iniciales si hacen falta. */
    await seedDatabase();

    /* Inicia el servidor en el puerto configurado. */
    app.listen(PORT, () => {
      console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    /* Muestra el error completo si falla el arranque. */
    console.error('Error al iniciar el backend:', error);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
  }
}

/* Ejecuta la función principal del servidor. */
startServer();