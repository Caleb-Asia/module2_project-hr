const express = require("express");
const router = express.Router();
const pool = require("../config/database");

router.get("/", async (req,res)=>{
  try{
    const [rows] = await pool.query(`
      SELECT
        e.id, e.name, e.position, e.dept,
        pt.hoursWorked, pt.grossPay, pt.tax, pt.ni as uif,
        pt.pension, pt.leaveDeductions, pt.netPay, pt.finalSalary
      FROM payroll_timesheet pt
      JOIN employees e ON e.id = pt.employeeId
      WHERE pt.month =?
    `, [req.query.month || "June 2026"]);

    res.json(rows);
  }catch(e){
    console.error(e);
    res.status(500).json({ error:"Failed to fetch payroll" });
  }
});

module.exports = router;