/* ===================================================================== */
/*              BUTSHA-DEV: PAYROLL MODEL (EXACT COLUMN MATCH)           */
/* ===================================================================== */

import { pool } from '../config/db.js';

export const PayrollModel = {
  // Get all payroll records
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT p.*, e.name as employee_name, e.dept as department
      FROM payroll_timesheet p
      JOIN employees e ON p.employeeId = e.id
    `);
    return rows;
  },

  // Get a single employee's payroll record by ID
  getByEmployeeId: async (employeeId) => {
    const [rows] = await pool.query(`
      SELECT p.*, e.name as employee_name, e.dept as department
      FROM payroll_timesheet p
      JOIN employees e ON p.employeeId = e.id
      WHERE p.employeeId = ?
    `, [employeeId]);
    return rows[0];
  },

  // Update a payroll record
  updatePayroll: async (payrollId, { gross, tax, uif_deduction, pension, finalSalary }) => {
    await pool.query(`
      UPDATE payroll_timesheet 
      SET gross = ?, leaveDeductions = ?, finalSalary = ?
      WHERE employeeId = ?
    `, [gross, tax, uif_deduction, pension, finalSalary, payrollId]);

    const [rows] = await pool.query('SELECT * FROM payroll_timesheet WHERE employeeId = ?', [payrollId]);
    return rows[0];
  },

  // Get summary statistics for the dashboard
  getSummary: async () => {
    const [rows] = await pool.query(`
      SELECT 
        COUNT(DISTINCT employeeId) as totalEmployees,
        SUM(gross) as totalGross,
        SUM(finalSalary) as totalNet,
        SUM(gross - finalSalary) as totalDeductions,
        AVG(finalSalary) as avgSalary
      FROM payroll_timesheet
    `);

    // mysql2 returns SUM()/AVG() results as strings (MySQL treats them as
    // DECIMAL), not JS numbers -- convert them here so the frontend's
    // toRand() (which does a strict typeof === "number" check) works.
    const summary = rows[0];
    return {
      totalEmployees: Number(summary.totalEmployees) || 0,
      totalGross: Number(summary.totalGross) || 0,
      totalNet: Number(summary.totalNet) || 0,
      totalDeductions: Number(summary.totalDeductions) || 0,
      avgSalary: Number(summary.avgSalary) || 0,
    };
  }
};