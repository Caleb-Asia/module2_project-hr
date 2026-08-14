const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.*, p.hoursWorked, p.leaveDeductions, p.finalSalary, p.gross
    FROM employees e
    LEFT JOIN payroll_timesheet p ON e.id = p.employeeId
  `);
  const formatted = rows.map((emp) => {
    const gross = emp.gross || emp.salary;
    const tax = gross * 0.26;
    const ni = gross * 0.01;
    const pension = gross * 0.075;
    const deductions = tax + ni + pension + (emp.leaveDeductions || 0);
    return {
      id: emp.id,
      name: emp.name,
      position: emp.position,
      dept: emp.dept,
      grossPay: gross,
      finalSalary: emp.finalSalary,
      hoursWorked: emp.hoursWorked,
      leaveDeductions: emp.leaveDeductions,
      tax,
      ni,
      pension,
      deductions,
      netPay: emp.finalSalary || gross - deductions,
      hourlyRate: gross / (emp.hoursWorked || 160),
    };
  });
  res.json(formatted);
});

module.exports = router;
