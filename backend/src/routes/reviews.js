/* ===================================================================== */
/*              CALEB-DEV: REVIEWS ROUTES                   */
/* ===================================================================== */

import express from 'express';
import pool from '../config/db.js'; // FIXED: Changed 'db' to 'pool'

const router = express.Router();

// 1. GET: Get all reviews with employee details
router.get('/', (req, res) => {
    const sql = `
        SELECT r.*, e.name AS employee_name, e.department
        FROM reviews r
        JOIN employees e ON r.employee_id = e.id  -- FIXED: e.employee_id -> e.id
        ORDER BY r.review_date DESC
    `;
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 2. GET: Get average rating
router.get('/average', (req, res) => {
    const sql = `SELECT AVG(rating) as avg_rating FROM reviews`;
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const avg = results[0].avg_rating ? parseFloat(results[0].avg_rating).toFixed(1) : "0.0";
        res.json({ average: avg });
    });
});

// 3. GET: Get total number of reviews
router.get('/stats', (req, res) => {
    const sql = `SELECT COUNT(*) as total_reviews FROM reviews`;
    pool.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ total: results[0].total_reviews });
    });
});

// 4. POST: Add a new review
router.post('/', (req, res) => {
    const { employee_id, rating, comments, quarter } = req.body;
    if (!employee_id || !rating || !comments) {
        return res.status(400).json({ error: "Employee, Rating, and Comments are required." });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }
    const reviewQuarter = quarter || `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`;
    const today = new Date().toISOString().split('T')[0];
   
    const sql = 'INSERT INTO reviews (employee_id, review_date, rating, comments, quarter) VALUES (?, ?, ?, ?, ?)';
    pool.query(sql, [employee_id, today, rating, comments, reviewQuarter], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Review added successfully", id: result.insertId });
    });
});

// 5. DELETE: Delete a single review by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM reviews WHERE id = ?';
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error deleting review:", err);
            return res.status(500).json({ error: err.message });
        }
       
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.json({ message: `Successfully deleted review.` });
    });
});

export default router;