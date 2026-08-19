import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// 1. GET: Get all reviews with employee details
router.get('/', async (req, res) => {
    try {
        // ✅ FIX: Use e.name and e.id to match your db_moderntech SQL
        const sql = `
            SELECT r.*, e.name as employee_name, e.dept as department
            FROM reviews r
            JOIN employees e ON r.employee_id = e.id
            ORDER BY r.review_date DESC
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: err.message });
    }
});

// 2. GET: Get average rating
router.get('/average', async (req, res) => {
    try {
        const sql = `SELECT AVG(rating) as avg_rating FROM reviews`;
        const [results] = await pool.query(sql);
        const avg = results[0].avg_rating ? parseFloat(results[0].avg_rating).toFixed(1) : "0.0";
        res.json({ average: avg });
    } catch (err) {
        console.error("Error fetching average rating:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. GET: Get total number of reviews
router.get('/stats', async (req, res) => {
    try {
        const sql = `SELECT COUNT(*) as total_reviews FROM reviews`;
        const [results] = await pool.query(sql);
        res.json({ total: results[0].total_reviews });
    } catch (err) {
        console.error("Error fetching review stats:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. POST: Add a new review
router.post('/', async (req, res) => {
    const { employee_id, rating, comments, quarter } = req.body;
    
    if (!employee_id || !rating || !comments) {
        return res.status(400).json({ error: "Employee, Rating, and Comments are required." });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const reviewQuarter = quarter || `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`;
    const today = new Date().toISOString().split('T')[0];
    
    try {
        const sql = 'INSERT INTO reviews (employee_id, review_date, rating, comments, quarter) VALUES (?, ?, ?, ?, ?)';
        const [result] = await pool.query(sql, [employee_id, today, rating, comments, reviewQuarter]);
        res.status(201).json({ message: "Review added successfully", id: result.insertId });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE: Delete a single review by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // ✅ FIX: Ensure we use the correct column name 'review_id'
        const sql = 'DELETE FROM reviews WHERE review_id = ?';
        const [result] = await pool.query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.json({ message: `Successfully deleted review.` });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;