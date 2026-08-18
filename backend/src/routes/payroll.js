/* ===================================================================== */
/*              BUTSHA-DEV: PAYROLL ROUTES (FINAL VERSION)               */
/* ===================================================================== */

import express from 'express';
import { PayrollModel } from '../models/payrollModel.js'; // Make sure this path is correct

const router = express.Router();

// 1. GET: Get all payroll records (with employee names)
router.get('/', async (req, res) => {
    try {
        const records = await PayrollModel.getAll();
        res.json(records);
    } catch (err) {
        console.error("Error fetching payroll:", err);
        res.status(500).json({ error: "Failed to fetch payroll records." });
    }
});

// 2. GET: Get a single employee's payroll record
router.get('/:id', async (req, res) => {
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

// 3. PUT: Update an existing payroll record
router.put('/:id', async (req, res) => {
    try {
        const updated = await PayrollModel.updatePayroll(req.params.id, req.body);
        res.json(updated);
    } catch (err) {
        console.error("Error updating payroll:", err);
        res.status(500).json({ error: "Failed to update payroll record." });
    }
});

// 4. GET: Payroll summary stats (for the dashboard cards)
router.get('/summary', async (req, res) => {
    try {
        const summary = await PayrollModel.getSummary();
        res.json(summary);
    } catch (err) {
        console.error("Error fetching payroll summary:", err);
        res.status(500).json({ error: "Failed to fetch payroll summary." });
    }
});

export default router;