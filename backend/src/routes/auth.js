import express from 'express';

const router = express.Router();

// Temporary placeholder route so the server doesn't crash
router.post('/login', (req, res) => {
    res.json({ message: "Auth route is working, but login logic not yet implemented." });
});

export default router;