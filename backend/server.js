import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

// TEMPORARY: Clear Database Route Imports
import User from './models/User.js';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import Subject from './models/Subject.js';
import Attendance from './models/Attendance.js';
import Application from './models/Application.js';
import Admin from './models/Admin.js';
import Fee from './models/Fee.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, '')) : [])
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log the blocked origin for debugging
      console.log('Allowed Origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/umsystem', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'University Management System API',
    status: 'Running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/fees', feeRoutes);

// TEMPORARY: Clear Database Route
app.delete('/api/nuke-db', async (req, res) => {
  try {
    console.log('☢️ NUKING DATABASE...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Application.deleteMany({});
    await Admin.deleteMany({});
    await Fee.deleteMany({});

    // 1. Create Admin Profile
    const adminProfile = await Admin.create({
      name: 'System Admin',
      email: 'admin@ums.com',
      role: 'Super Admin',
      password: 'admin123' // This will be hashed by Admin model pre-save hook
    });

    // 2. Create Admin User (for Auth)
    // Note: User model hashes password in pre-save hook, so we provide PLAIN TEXT
    await User.create({
      name: 'System Admin',
      email: 'admin@ums.com',
      password: 'admin123', // Plain text, will be hashed by model
      role: 'admin',
      adminId: adminProfile._id // Link to Admin Profile
    });

    console.log('✅ DATABASE CLEARED & ADMIN SEEDED');
    res.json({ success: true, message: 'Database cleared and admin seeded.' });
  } catch (error) {
    console.error('Error nuking DB:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
  });
};

startServer();
