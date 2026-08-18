/* ===================================================================== */
/*              CHAD-DEV: DATABASE CONNECTION                             */
/* ===================================================================== */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// --- Validate required environment variables up front ---
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}. ` +
      `Check your .env file.`,
  );
}

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

/* ===================================================================== */
/*              BUTSHA-DEV: DATABASE CONNECTION                          */
/* ===================================================================== */

// --- Verify the pool can actually reach the database on startup ---
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      `Butsha's DB Connected to MySQL database "${process.env.DB_NAME}" at ${process.env.DB_HOST}:${
        process.env.DB_PORT || 3306
      }`,
    );
    connection.release();
  } catch (err) {
    console.error("Butsha's DB Failed to connect to MySQL database:", err.message);
  }
})();

/* ===================================================================== */
/*              CALEB-DEV: DATABASE CONNECTION                           */
/* ===================================================================== */

// Caleb's connection test using the shared pool
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Caleb's DB connection test successful!");
    connection.release();
  } catch (err) {
    console.error("Caleb's DB connection test failed:", err.message);
  }
})();

/* ===================================================================== */
/*              EXPORT THE SHARED POOL                                   */
/* ===================================================================== */

export { pool };
export default pool;