import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const DB_NAME = process.env.DB_NAME || 'uisbetdb';

const baseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'un_usr',
  password: process.env.DB_PASSWORD || 'una_clave',
  port: Number(process.env.DB_PORT || 3306),
  multipleStatements: true,
};

export const pool = mysql.createPool({
  ...baseConfig,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* Crea BD y tablas automáticamente. */
export async function initializeDatabase() {
  const connection = await mysql.createConnection(baseConfig);

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.query(`USE \`${DB_NAME}\``);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','user') DEFAULT 'user',
      balance INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* Migración: agrega balance si la tabla ya existía sin esa columna. */
  const [balCols] = await connection.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'balance'`,
    [DB_NAME]
  );
  if (balCols.length === 0) {
    await connection.query('ALTER TABLE users ADD COLUMN balance INT DEFAULT 0');
  }

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

  await connection.query(`
    CREATE TABLE IF NOT EXISTS purchases (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      package_id INT NOT NULL,
      payment_reference VARCHAR(80) DEFAULT NULL,
      status ENUM('pendiente','pagada','cancelada') DEFAULT 'pagada',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (package_id) REFERENCES chip_packages(id) ON DELETE CASCADE
    )
  `);

  await connection.end();
}