const mysql = require("mysql2/promise");
require("dotenv").config();

// --- Validate required environment variables up front ---
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}. ` +
      `Check your .env file.`,
  );
}

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

// --- Verify the pool can actually reach the database on startup ---
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      `Connected to MySQL database "${process.env.DB_NAME}" at ${process.env.DB_HOST}:${
        process.env.DB_PORT || 3306
      }`,
    );
    connection.release();
  } catch (err) {
    console.error("Failed to connect to MySQL database:", err.message);
  }
})();

module.exports = pool;
