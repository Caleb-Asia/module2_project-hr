import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../models/userModel.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log("Attempting login for:", username); // <-- ADD THIS

        const user = await getUserByUsername(username);
        console.log(" Database returned:", user); // <-- ADD THIS (This will show exactly what is happening)

        if (!user) {
            console.log("User is null/undefined");
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log(` Password entered (length ${password.length}): "${password}"`);
        const validPassword = await bcrypt.compare(password, user.password_hash);
        console.log(" bcrypt compare result:", validPassword);

        if (!validPassword) {
            console.log(" Password did not match");
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) {
        console.error(" Server Crash Error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
});

export default router;