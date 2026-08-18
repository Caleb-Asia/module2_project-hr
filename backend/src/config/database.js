import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create the MySQL connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.message);
    } else {
        console.log(' Connected to MySQL database successfully!');
        connection.release(); 
    }
});


export const pool = db;
export default db;
