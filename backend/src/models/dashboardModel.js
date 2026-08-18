import { pool } from '../config/database.js';

export const getTotalEmployees = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM employees');
    return rows[0].count;
};

export const getApprovedLeaveCount = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM time_off WHERE status = "Approved"');
    return rows[0].count;
};

export const getTotalPayroll = async () => {
    const [rows] = await pool.query('SELECT SUM(net_pay) as total FROM payroll');
    return rows[0].total || 0;
};

export const getOpenRequests = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM time_off WHERE status = "Pending"');
    return rows[0].count;
};

export const getGrowthTrend = async () => {
    const [rows] = await pool.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as new_employees 
        FROM employees 
        GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
        ORDER BY month ASC
    `);
    return rows;
};