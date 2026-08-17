import { EmployeeModel } from '../models/employee.model.js';
export const getEmployees = async (req, res) => {
  try { const employees = await EmployeeModel.getAll(); res.json(employees); } catch (err) { res.status(500).json({ error: err.message }); }
};
export const getEmployee = async (req, res) => {
  try { const emp = await EmployeeModel.getById(req.params.id); if (!emp) return res.status(404).json({ message: 'Employee not found' }); res.json(emp); } catch (err) { res.status(500).json({ error: err.message }); }
};
export const createEmployee = async (req, res) => {
  try {
    const { name, position, dept, salary, contact } = req.body;
    if (!name || !position || !dept || !salary || !contact) return res.status(400).json({ message: 'name, position, dept, salary, contact required' });
    const newEmp = await EmployeeModel.create(req.body);
    res.status(201).json(newEmp);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
export const updateEmployee = async (req, res) => {
  try { const updated = await EmployeeModel.update(req.params.id, req.body); if (!updated) return res.status(404).json({ message: 'Not found' }); res.json(updated); } catch (err) { res.status(500).json({ error: err.message }); }
};
export const deleteEmployee = async (req, res) => {
  try { const deleted = await EmployeeModel.delete(req.params.id); if (!deleted) return res.status(404).json({ message: 'Not found' }); res.json({ message: 'Deleted, payroll removed via CASCADE' }); } catch (err) { res.status(500).json({ error: err.message }); }
};
