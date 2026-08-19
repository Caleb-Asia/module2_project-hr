/* ===================================================================== */
/*              BUTSHA-DEV: EMPLOYEE MODEL (MATCHED TO SQL)              */
/* ===================================================================== */

import { pool } from '../config/db.js';

export const EmployeeModel = {
  // Get all employees - explicitly select the columns your frontend expects
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        name, 
        position, 
        dept as department,     -- Maps SQL 'dept' to frontend 'department'
        salary, 
        contact as email,       -- Maps SQL 'contact' to frontend 'email'
        history, 
        status, 
        score 
      FROM employees 
      ORDER BY id
    `);
    return rows;
  },

  // Get a single employee by ID
  getById: async (id) => {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        name, 
        position, 
        dept as department, 
        salary, 
        contact as email, 
        history, 
        status, 
        score 
      FROM employees 
      WHERE id = ?
    `, [id]);
    return rows[0];
  },

  // Create a new employee
  create: async (data) => {
    // Map frontend 'department' and 'email' to SQL 'dept' and 'contact'
    const { name, position, department, salary, email, history, status, score } = data;
    
    const [result] = await pool.query(
      `INSERT INTO employees (name, position, dept, salary, contact, history, status, score) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, position, department, salary, email, history || '', status || 'Active', score || 85]
    );
    
    return { id: result.insertId, ...data };
  },

  // Update an employee
  update: async (id, data) => {
    const fields = [];
    const values = [];
    
    // Map frontend keys to actual database column names
    const keyMap = {
      name: 'name',
      position: 'position',
      department: 'dept',
      salary: 'salary',
      email: 'contact',
      history: 'history',
      status: 'status',
      score: 'score'
    };

    for (let [frontendKey, dbKey] of Object.entries(keyMap)) {
      if (data[frontendKey] !== undefined) {
        fields.push(dbKey + ' = ?');
        values.push(data[frontendKey]);
      }
    }

    if (!fields.length) return null;
    values.push(id);
    
    await pool.query('UPDATE employees SET ' + fields.join(', ') + ' WHERE id = ?', values);
    
    return await EmployeeModel.getById(id);
  },

  // Delete an employee
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [id]);
    return result.affectedRows;
  }
};