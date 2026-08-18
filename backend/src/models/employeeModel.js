/* ===================================================================== */
/*              BUTSHA-DEV: EMPLOYEE MODEL (ES6 FIXED)                   */
/* ===================================================================== */

import { pool } from '../config/db.js'; // FIXED: Correct import path

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
    const { name, position, department, salary, email, history, status, score } = data;
    
    // AUTO_INCREMENT handles the ID for us, so we don't need to manually calculate it.
    const [result] = await pool.query(
      'INSERT INTO employees (name, position, department, salary, email, history, status, score) VALUES (?,?,?,?,?,?,?,?)',
      [name, position, department, salary, email, history || '', status || 'Active', score || 85]
    );
    
    // ⚠️ COMMENTED OUT: We don't have a 'payroll_timesheet' table in our shared DB.
    // await pool.query(
    //   'INSERT INTO payroll_timesheet (employeeId, hoursWorked, leaveDeductions, finalSalary, gross) VALUES (?,?,?,?,?)',
    //   [result.insertId, 160, 0, salary, salary]
    // );
    
    return { id: result.insertId, ...data };
  },
  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (let k of ['name','position','department','salary','email','history','status','score']) {
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