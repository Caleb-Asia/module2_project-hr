import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

console.log("JWT_SECRET loaded as:", process.env.JWT_SECRET); 

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err.message); // This will show us WHY it failed!
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};