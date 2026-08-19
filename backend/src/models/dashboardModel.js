import { pool } from '../config/db.js';

export const getTotalEmployees = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM employees');
    return rows[0].count;
};

export const getApprovedLeaveCount = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM time_off WHERE status = "Approved"');
    return rows[0].count;
};

export const getTotalPayroll = async () => {
    // ✅ FIX: Changed table name to 'payroll_timesheet' and column to 'finalSalary'
    const [rows] = await pool.query('SELECT SUM(finalSalary) as total FROM payroll_timesheet');
    return rows[0].total || 0;
};

export const getOpenRequests = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM time_off WHERE status = "Pending"');
    return rows[0].count;
};

export const getGrowthTrend = async () => {
    
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM employees');
    const total = rows[0].total || 0;
    
   
    return [
        { month: 'Current', new_employees: total }
    ];
};