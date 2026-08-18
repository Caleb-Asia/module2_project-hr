import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes - UPDATED PATHS TO INCLUDE 'src/'
import authRoutes from './src/routes/auth.js';
import dashboardRoutes from './src/routes/dashboard.js';
import timeoffRoutes from './src/routes/timeoff.js';
import employeesRoutes from './src/routes/employees.js';
import payrollRoutes from './src/routes/payroll.js';
import attendanceRoutes from './src/routes/attendance.js';
import reviewsRoutes from './src/routes/reviews.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/timeoff', timeoffRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reviews', reviewsRoutes);

// Global 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});