const express = require("express");
const router = express.Router();
const pool = require("../db");

const avatarColors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#6366F1",
];
function toRand(a) {
  return "R" + Number(a).toLocaleString("en-ZA", { maximumFractionDigits: 0 });
}
function formatEmployee(emp, idx = 0) {
  return {
    id: emp.id,
    name: emp.name,
    position: emp.position,
    dept: emp.dept,
    salary: Number(emp.salary),
    contact: emp.contact,
    history: emp.history,
    status: emp.status,
    score: Number(emp.score),
    color: avatarColors[idx % avatarColors.length],
    initials: emp.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
    formattedSalary: toRand(emp.salary),
  };
}

router.get("/", async (req, res) => {
  const { search, dept, minScore } = req.query;
  let sql = "SELECT * FROM employees WHERE 1=1";
  let params = [];
  if (search) {
    sql += " AND (name LIKE? OR position LIKE? OR dept LIKE? OR contact LIKE?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (dept) {
    sql += " AND dept =?";
    params.push(dept);
  }
  if (minScore) {
    sql += " AND score >=?";
    params.push(minScore);
  }
  const [rows] = await pool.query(sql, params);
  res.json(rows.map((r, i) => formatEmployee(r, i)));
});

router.get("/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM employees WHERE id=?", [
    req.params.id,
  ]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  // also get payroll + attendance for that employee
  const [pay] = await pool.query(
    "SELECT * FROM payroll_timesheet WHERE employeeId=?",
    [req.params.id],
  );
  const [att] = await pool.query(
    "SELECT * FROM attendance WHERE employeeId=? ORDER BY date DESC LIMIT 5",
    [req.params.id],
  );
  const [leave] = await pool.query(
    "SELECT * FROM leave_requests WHERE employeeId=?",
    [req.params.id],
  );
  res.json({
    ...formatEmployee(rows[0]),
    payroll: pay[0] || null,
    recentAttendance: att,
    leaveRequests: leave,
  });
});

module.exports = router;
