import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

/* Carga las variables del archivo .env. */
dotenv.config();

/* Nombre de la base de datos.
Si no existe en .env, usa 'uisbetdb' por defecto. */
export const DB_NAME = process.env.DB_NAME || 'uisbetdb';

/* Configuración base para conectarse a MySQL. */
const baseConfig = {
  /* Dirección del servidor de base de datos. */
  host: process.env.DB_HOST || 'localhost',

  /* Usuario de MySQL. */
  user: process.env.DB_USER || 'un_usr',

  /* Contraseña del usuario de MySQL. */
  password: process.env.DB_PASSWORD || 'una_clave',

  /* Puerto en el que corre MySQL. */
  port: Number(process.env.DB_PORT || 3306),

  /* Permite ejecutar varias sentencias SQL en una misma conexión si se necesita. */
  multipleStatements: true,
};

/* Pool de conexiones reutilizable para el resto del backend. */
export const pool = mysql.createPool({
  ...baseConfig,

  /* Base de datos a usar en las consultas normales. */
  database: DB_NAME,

  /* Si todas las conexiones están ocupadas, espera una libre. */
  waitForConnections: true,

  /* Número máximo de conexiones simultáneas. */
  connectionLimit: 10,

  /* Cantidad máxima de peticiones en cola.
  0 significa sin límite. */
  queueLimit: 0,
});

/* Crea la base de datos y las tablas automáticamente. */
export async function initializeDatabase() {
  /* Crea una conexión directa usando la configuración base.
  Aquí todavía no se especifica una base de datos porque primero puede que haya que crearla. */
  const connection = await mysql.createConnection(baseConfig);

  /* Crea la base de datos si no existe. */
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);

  /* Selecciona la base de datos para trabajar dentro de ella. */
  await connection.query(`USE \`${DB_NAME}\``);

  /* Crea la tabla de usuarios si no existe. */
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* Crea la tabla de paquetes de fichas si no existe. */
  await connection.query(`
    CREATE TABLE IF NOT EXISTS chip_packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      chips INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* Crea la tabla de compras si no existe. */
  await connection.query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      package_id INT NOT NULL,
      payment_reference VARCHAR(80) DEFAULT NULL,
      status ENUM('pendiente','pagada','cancelada') DEFAULT 'pagada',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      /* Relaciona cada compra con un usuario existente. */
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

      /* Relaciona cada compra con un paquete existente. */
      FOREIGN KEY (package_id) REFERENCES chip_packages(id) ON DELETE CASCADE
    )
  `);

  /* Cierra la conexión usada para la inicialización. */
  await connection.end();
}