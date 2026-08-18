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

// ======================================================================
// 3. BUTSHA-DEV: EMPLOYEES & PAYROLL ROUTES
// ======================================================================
import employeesRoutes from './routes/employees.js';
import payrollRoutes from './routes/payroll.js';

app.use('/api/employees', employeesRoutes);
app.use('/api/payroll', payrollRoutes);

// ======================================================================
// 4. CALEB-DEV: ATTENDANCE & REVIEWS ROUTES
// ======================================================================
import attendanceRoutes from './routes/attendance.js';
import reviewsRoutes from './routes/reviews.js';

app.use('/api/attendance', attendanceRoutes);
app.use('/api/reviews', reviewsRoutes);

// ======================================================================
// 5. GLOBAL ERROR HANDLERS (Adds professional polish)
// ======================================================================
// Handles 404 errors (Route not found)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Handles 500 errors (Server crashes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

// ================================
// START THE SERVER
// ================================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});