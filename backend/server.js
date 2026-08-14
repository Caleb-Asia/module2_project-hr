const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const employeeRoutes = require("./src/routes/employees.js");
const payrollRoutes = require("./src/routes/payroll.js");

app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Express Error]", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
