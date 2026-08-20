/* ===================================================================== */
/*              BUTSHA-DEV: PAYROLL ROUTES (FIXED ORDER)                 */
/* ===================================================================== */

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { PayrollModel } from '../models/payrollModel.js';

const router = express.Router();

// 1. GET: Get all payroll records
router.get('/', authenticateToken, async (req, res) => {
    try {
        const records = await PayrollModel.getAll();
        res.json(records);
    } catch (err) {
        console.error("Error fetching payroll:", err);
        res.status(500).json({ error: "Failed to fetch payroll records." });
    }
});


// 2. GET: Payroll summary stats (for the dashboard cards)
router.get('/summary', authenticateToken, async (req, res) => {
    try {
        const summary = await PayrollModel.getSummary();
        res.json(summary);
    } catch (err) {
        console.error("Error fetching payroll summary:", err);
        res.status(500).json({ error: "Failed to fetch payroll summary." });
    }
});

// 3. GET: A single employee's payroll record
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const record = await PayrollModel.getByEmployeeId(req.params.id);
        if (!record) {
            return res.status(404).json({ error: "Payroll record not found." });
        }
        res.json(record);
    } catch (err) {
        console.error("Error fetching payroll record:", err);
        res.status(500).json({ error: "Failed to fetch payroll record." });
    }
});

// 4. PUT: Update an existing payroll record
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const updated = await PayrollModel.updatePayroll(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        console.error("Error updating payroll:", err);
        res.status(500).json({ error: "Failed to update payroll record." });
    }
});

export default router;