import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Load environment variables FIRST, before anything else!
dotenv.config(); 

// 2. Import routes AFTER the environment variables are loaded
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import timeoffRoutes from './routes/timeoff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'ModernTech HR Backend API is running!' });
});

app.use('/api/auth', authRoutes);      
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/timeoff', timeoffRoutes);     

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});