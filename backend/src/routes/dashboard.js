import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getTotalEmployees, getApprovedLeaveCount, getTotalPayroll, 
    getOpenRequests, getGrowthTrend 
} from '../models/dashboardModel.js';
import { pool } from '../config/db.js'; // Import pool to fetch recent activity

const router = express.Router();

// 1. GET: Dashboard Stats
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const totalEmployees = await getTotalEmployees();
        const approvedLeave = await getApprovedLeaveCount();
        const payrollCycle = await getTotalPayroll();
        const openRequests = await getOpenRequests();
        const growthTrend = await getGrowthTrend();

        res.json({ totalEmployees, approvedLeave, payrollCycle, openRequests, growthTrend });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});

// 2. GET: Recent Activity (Time Off Requests)
router.get('/recent-activity', authenticateToken, async (req, res) => {
    try {
        // Fetch the 5 most recent time-off requests with employee names
        const sql = `
            SELECT 
                t.id,
                t.leave_type,
                t.start_date,
                t.status,
                e.name as employee_name
            FROM time_off t
            JOIN employees e ON t.employee_id = e.id
            ORDER BY t.created_at DESC
            LIMIT 5
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching recent activity:", err);
        res.status(500).json({ error: 'Error fetching recent activity' });
    }
});

export default router;