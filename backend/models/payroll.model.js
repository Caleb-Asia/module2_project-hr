import { pool } from '../config/db.js';

export const PayrollModel = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT 
        e.id, e.name, e.position, e.dept, e.salary as baseSalary, e.status,
        p.employeeId, p.hoursWorked, p.leaveDeductions, p.finalSalary, p.gross,
        (p.gross - p.finalSalary) as totalDeductions,
        ROUND((p.finalSalary / NULLIF(p.hoursWorked,0)),2) as hourlyRate
      FROM employees e
      LEFT JOIN payroll_timesheet p ON e.id = p.employeeId
      ORDER BY e.id
    `);
    return rows;
  },
  getByEmployeeId: async (employeeId) => {
    const [rows] = await pool.query(`
      SELECT e.*, p.*, (p.gross - p.finalSalary) as deductions
      FROM employees e JOIN payroll_timesheet p ON e.id = p.employeeId WHERE e.id = ?
    `, [employeeId]);
    return rows[0];
  },
  updateTimesheet: async (employeeId, { hoursWorked, leaveDeductions, finalSalary, gross }) => {
    if (gross === undefined) {
      const [emp] = await pool.query('SELECT salary FROM employees WHERE id = ?', [employeeId]);
      gross = emp[0]?.salary || 0;
    }
    if (finalSalary === undefined && leaveDeductions !== undefined) {
      const hourly = gross / 160;
      finalSalary = gross - (leaveDeductions * hourly);
    }
    await pool.query(`
      UPDATE payroll_timesheet 
      SET hoursWorked = COALESCE(?, hoursWorked),
          leaveDeductions = COALESCE(?, leaveDeductions),
          finalSalary = COALESCE(?, finalSalary),
          gross = COALESCE(?, gross)
      WHERE employeeId = ?
    `, [hoursWorked, leaveDeductions, finalSalary, gross, employeeId]);
    const [rows] = await pool.query('SELECT e.*, p.* FROM employees e JOIN payroll_timesheet p ON e.id = p.employeeId WHERE e.id = ?', [employeeId]);
    return rows[0];
  },
  recalculateFromAttendance: async (employeeId) => {
    const [att] = await pool.query("SELECT COUNT(*) as absent FROM attendance WHERE employeeId = ? AND status = 'Absent'", [employeeId]);
    const [emp] = await pool.query('SELECT salary FROM employees WHERE id = ?', [employeeId]);
    if (!emp[0]) return null;
    const gross = emp[0].salary;
    const absentDays = att[0].absent;
    const leaveDeductionHours = absentDays * 8;
    const hourly = gross / 160;
    const finalSalary = gross - (leaveDeductionHours * hourly);
    await pool.query('UPDATE payroll_timesheet SET hoursWorked = ?, leaveDeductions = ?, finalSalary = ?, gross = ? WHERE employeeId = ?',
      [160 - leaveDeductionHours, leaveDeductionHours, Math.round(finalSalary), gross, employeeId]);
    const [rows] = await pool.query('SELECT e.*, p.* FROM employees e JOIN payroll_timesheet p ON e.id = p.employeeId WHERE e.id = ?', [employeeId]);
    return rows[0];
  },
  getSummary: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as totalEmployees, SUM(gross) as totalGross, SUM(finalSalary) as totalNet, SUM(gross - finalSalary) as totalDeductions, AVG(finalSalary) as avgSalary FROM payroll_timesheet');
    return rows[0];
  }
};
