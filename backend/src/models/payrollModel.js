/* ===================================================================== */
/*              BUTSHA-DEV: PAYROLL MODEL (FIXED FOR YOUR DB)            */
/* ===================================================================== */

import { pool } from '../config/db.js';

export const PayrollModel = {
  // Get all payroll records
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT p.*, e.name as employee_name, e.department
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      ORDER BY p.year DESC, p.month DESC
    `);
    return rows;
  },

  // Get a single employee's payroll record by ID
  getByEmployeeId: async (employeeId) => {
    const [rows] = await pool.query(`
      SELECT p.*, e.name as employee_name, e.department
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      WHERE p.employee_id = ?
    `, [employeeId]);
    return rows[0];
  },

  // Update a payroll record
  updatePayroll: async (payrollId, { gross, tax, uif, pension, net_pay }) => {
    // Map the inputs to your actual column names
    await pool.query(`
      UPDATE payroll 
      SET gross = ?, tax = ?, uif = ?, pension = ?, net_pay = ?
      WHERE id = ?
    `, [gross, tax, uif, pension, net_pay, payrollId]);

    const [rows] = await pool.query('SELECT * FROM payroll WHERE id = ?', [payrollId]);
    return rows[0];
  },

  // Get summary statistics for the dashboard
  getSummary: async () => {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(DISTINCT employee_id) as totalEmployees,
        SUM(gross) as totalGross,
        SUM(net_pay) as totalNet,
        SUM(tax + uif + pension) as totalDeductions,
        AVG(net_pay) as avgSalary
      FROM payroll
    `);
    return rows[0];
  }
};