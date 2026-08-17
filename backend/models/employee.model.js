import { pool } from '../config/db.js';

export const EmployeeModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY id');
    return rows;
  },
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  },
  create: async (data) => {
    const { name, position, dept, salary, contact, history, status, score } = data;
    const [maxRow] = await pool.query('SELECT MAX(id) as maxId FROM employees');
    const newId = (maxRow[0].maxId || 0) + 1;
    await pool.query(
      'INSERT INTO employees (id, name, position, dept, salary, contact, history, status, score) VALUES (?,?,?,?,?,?,?,?,?)',
      [newId, name, position, dept, salary, contact, history || '', status || 'Active', score || 85]
    );
    await pool.query(
      'INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (?,?,?,?,?)',
      [newId, 160, 0, salary, salary]
    );
    return { id: newId, ...data };
  },
  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (let k of ['name','position','dept','salary','contact','history','status','score']) {
      if (data[k] !== undefined) {
        fields.push(k + ' = ?');
        values.push(data[k]);
      }
    }
    if (!fields.length) return null;
    values.push(id);
    await pool.query('UPDATE employees SET ' + fields.join(', ') + ' WHERE id = ?', values);
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
    return rows[0];
  },
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows;
  }
};
