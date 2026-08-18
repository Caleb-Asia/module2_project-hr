import { pool } from '../config/db.js';

export const getUserByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0]; 
};