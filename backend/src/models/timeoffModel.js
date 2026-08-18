import { pool } from '../config/db.js';

export const getAllTimeOff = async () => {
    const [rows] = await pool.query(`
        SELECT time_off.*, employees.name as employee_name 
        FROM time_off 
        JOIN employees ON time_off.employee_id = employees.id
    `);
    return rows;
};

export const createTimeOff = async (employee_id, leave_type, start_date, end_date, reason) => {
    await pool.query(
        'INSERT INTO time_off (employee_id, leave_type, start_date, end_date, reason) VALUES (?, ?, ?, ?, ?)',
        [employee_id, leave_type, start_date, end_date, reason]
    );
};

export const updateTimeOffStatus = async (id, status) => {
    await pool.query('UPDATE time_off SET status = ? WHERE id = ?', [status, id]);
};