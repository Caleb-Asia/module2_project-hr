import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// 1. GET: Get all attendance records (For the main table)
router.get('/', (req, res) => {
    const sql = `
        SELECT a.*, e.first_name, e.last_name, e.department 
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
        ORDER BY a.attendance_date DESC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching attendance:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 2. GET: Get attendance statistics 
router.get('/stats', (req, res) => {
    const sql = `
        SELECT 
            COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
            COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent_count,
            COUNT(*) AS total
        FROM attendance
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching attendance stats:", err);
            return res.status(500).json({ error: err.message });
        }
        
        const total = results[0].total || 0;
        
        // Calculate percentages, handle division by zero safely
        let present_percent = 0;
        let absent_percent = 0;
        
        if (total > 0) {
            present_percent = Math.round((results[0].present_count / total) * 100);
            absent_percent = Math.round((results[0].absent_count / total) * 100);
        }

        res.json({ 
            present_percent, 
            absent_percent, 
            total_checks: total 
        });
    });
});

// 3. POST: Add a new attendance record
router.post('/', (req, res) => {
    const { employee_id, date, status } = req.body;
    
    // Server-side validation
    if (!employee_id || !date || !status) {
        return res.status(400).json({ error: "Employee ID, Date, and Status are required." });
    }

    // Validate status is only 'Present' or 'Absent'
    if (status !== 'Present' && status !== 'Absent') {
        return res.status(400).json({ error: "Status must be 'Present' or 'Absent'." });
    }

    const sql = 'INSERT INTO attendance (employee_id, attendance_date, status) VALUES (?, ?, ?)';
    db.query(sql, [employee_id, date, status], (err, result) => {
        if (err) {
            console.error("Error adding attendance:", err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            message: "Attendance record added successfully", 
            id: result.insertId 
        });
    });
});

// 4. DELETE: Delete a SINGLE attendance record by Employee ID and Date
router.delete('/:employeeId/:date', (req, res) => {
    const { employeeId, date } = req.params;

    if (!employeeId || !date) {
        return res.status(400).json({ error: "Employee ID and Date are required." });
    }

    const sql = 'DELETE FROM attendance WHERE employee_id = ? AND attendance_date = ?';
    db.query(sql, [employeeId, date], (err, result) => {
        if (err) {
            console.error("Error deleting attendance:", err);
            return res.status(500).json({ error: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No attendance record found for this employee on that date." });
        }

        res.json({ 
            message: `Successfully deleted 1 record.` 
        });
    });
});

export default router;