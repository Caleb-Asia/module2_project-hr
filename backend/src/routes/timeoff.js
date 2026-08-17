import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllTimeOff, createTimeOff, updateTimeOffStatus } from '../models/timeoffModel.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const requests = await getAllTimeOff();
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching time off' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { employee_id, leave_type, start_date, end_date, reason } = req.body;
    if (!employee_id || !leave_type || !start_date || !end_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        await createTimeOff(employee_id, leave_type, start_date, end_date, reason);
        res.status(201).json({ message: 'Request submitted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error submitting request' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || (status !== 'Approved' && status !== 'Rejected')) {
        return res.status(400).json({ error: 'Invalid status value' });
    }
    try {
        await updateTimeOffStatus(id, status);
        res.json({ message: `Request ${status.toLowerCase()} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating time off status' });
    }
});

export default router;