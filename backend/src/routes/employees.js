/* ===================================================================== */
/*              BUTSHA-DEV: EMPLOYEES ROUTES                             */
/* ===================================================================== */

import express from 'express';
import { EmployeeModel } from '../models/employeeModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const employees = await EmployeeModel.getAll();
        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const employee = await EmployeeModel.getById(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        res.json(employee);
    } catch (err) {
        console.error("Error fetching employee:", err);
        res.status(500).json({ error: "Failed to fetch employee" });
    }
});

router.post('/', async (req, res) => {
    try {
        const newEmployee = await EmployeeModel.create(req.body);
        res.status(201).json(newEmployee);
    } catch (err) {
        console.error("Error creating employee:", err);
        res.status(500).json({ error: "Failed to create employee" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await EmployeeModel.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: "Employee not found" });
        res.json(updated);
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Failed to update employee" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const affectedRows = await EmployeeModel.delete(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ error: "Employee not found" });
        res.json({ message: "Employee deleted successfully" });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ error: "Failed to delete employee" });
    }
});

export default router;