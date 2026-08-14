import express from 'express';

const router = express.Router();

// Temporary placeholder so the server doesn't crash
router.get('/', (req, res) => {
    res.json({ message: "Time Off route is working, but logic not yet implemented." });
});

export default router;