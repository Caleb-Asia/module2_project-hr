import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { 
    getTotalEmployees, getApprovedLeaveCount, getTotalPayroll, 
    getOpenRequests, getGrowthTrend 
} from '../models/dashboardModel.js';

const router = express.Router();

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

export default router;