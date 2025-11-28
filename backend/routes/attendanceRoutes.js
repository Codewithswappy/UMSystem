import express from 'express';
import {
    markAttendance,
    getStudentAttendance,
    getClassAttendance,
    getMyStudentsForAttendance
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Faculty routes
router.post('/mark', protect, authorize('faculty'), markAttendance);
router.get('/class', protect, authorize('faculty', 'admin'), getClassAttendance);
router.get('/my-students', protect, authorize('faculty'), getMyStudentsForAttendance);

// Student routes
router.get('/my-attendance', protect, authorize('student'), getStudentAttendance);

export default router;
