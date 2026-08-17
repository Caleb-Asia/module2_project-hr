import express from 'express';
import { getPayroll, getPayslip, updatePayroll, recalculatePayroll, getPayrollSummary } from '../controllers/payroll.controller.js';
const router = express.Router();
router.get('/', getPayroll);
router.get('/summary', getPayrollSummary);
router.get('/:employeeId', getPayslip);
router.put('/:employeeId', updatePayroll);
router.post('/:employeeId/recalculate', recalculatePayroll);
export default router;
