/* ========================================================= */
/*              MODERNTECH HR BACKEND SERVER                  */
/* ========================================================= */

// ================================
// GLOBAL IMPORTS & CONFIGURATION
// ================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ================================
// 1. ROOT TEST ROUTE
// ================================
app.get('/', (req, res) => {
    res.json({ message: 'ModernTech HR Backend API is running!' });
});

// ======================================================================
// 2. CHAD-DEV: LOGIN, DASHBOARD & TIME OFF ROUTES (COMPLETED)
// ======================================================================
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import timeoffRoutes from './routes/timeoff.js';

app.use('/api/auth', authRoutes);      
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/timeoff', timeoffRoutes);     



// ================================
// START THE SERVER
// ================================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});