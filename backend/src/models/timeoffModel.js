import { pool } from '../config/db.js';

export const getAllTimeOff = async () => {
    const [rows] = await pool.query(`
        SELECT 
            time_off.*, 
            employees.name as employee_name,
            time_off.created_at
        FROM time_off 
        JOIN employees ON time_off.employee_id = employees.id
        ORDER BY time_off.created_at DESC
    `);
    return rows;
};

export const createTimeOff = async (employee_id, leave_type, start_date, end_date, reason) => {
    await pool.query(
        `INSERT INTO time_off (employee_id, leave_type, start_date, end_date, reason, status) 
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [employee_id, leave_type, start_date, end_date, reason]
    );
};

export const updateTimeOffStatus = async (id, status) => {
    await pool.query('UPDATE time_off SET status = ? WHERE id = ?', [status, id]);
};