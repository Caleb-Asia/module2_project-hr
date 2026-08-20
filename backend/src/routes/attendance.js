import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// 1. GET: Get all attendance records
router.get('/', async (req, res) => {
    try {
        
        const sql = `
            SELECT a.*, e.name as employee_name, e.dept as department
            FROM attendance a
            JOIN employees e ON a.employee_id = e.id
            ORDER BY a.attendance_date DESC
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET: Get attendance statistics
router.get('/stats', async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
                COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent_count,
                COUNT(*) AS total
            FROM attendance
        `;
        const [results] = await pool.query(sql);
        
        const total = results[0].total || 0;
        let present_percent = 0;
        let absent_percent = 0;
        
        if (total > 0) {
            present_percent = Math.round((results[0].present_count / total) * 100);
            absent_percent = Math.round((results[0].absent_count / total) * 100);
        }

        res.json({ present_percent, absent_percent, total_checks: total });
    } catch (err) {
        console.error("Error fetching attendance stats:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. POST: Add a new attendance record
router.post('/', async (req, res) => {
    const { employee_id, date, status } = req.body;
    
    if (!employee_id || !date || !status) {
        return res.status(400).json({ error: "Employee ID, Date, and Status are required." });
    }

    if (status !== 'Present' && status !== 'Absent') {
        return res.status(400).json({ error: "Status must be 'Present' or 'Absent'." });
    }

    try {
        const sql = 'INSERT INTO attendance (employee_id, attendance_date, status) VALUES (?, ?, ?)';
        const [result] = await pool.query(sql, [employee_id, date, status]);
        res.status(201).json({ message: "Attendance record added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding attendance:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE: Delete a SINGLE attendance record
router.delete('/:employeeId/:date', async (req, res) => {
    const { employeeId, date } = req.params;
    const cleanDate = date.split('T')[0]; 

    try {
        const sql = 'DELETE FROM attendance WHERE employee_id = ? AND attendance_date = ?';
        const [result] = await pool.query(sql, [employeeId, cleanDate]);
        
        console.log("✅ MySQL affected rows:", result.affectedRows);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No attendance record found for this employee on that date." });
        }

        res.json({ message: `Successfully deleted 1 record.` });
    } catch (err) {
        console.error("Error deleting attendance:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;