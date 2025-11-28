import express from 'express';
import {
    getStudentsForGrading,
    submitGrades,
    publishResults,
    getStudentResults,
    getResultStatistics
} from '../controllers/resultController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Faculty routes
router.get('/faculty/students', protect, authorize('faculty'), getStudentsForGrading);
router.post('/faculty/submit-grades', protect, authorize('faculty'), submitGrades);
router.post('/faculty/publish', protect, authorize('faculty'), publishResults);
router.get('/faculty/statistics', protect, authorize('faculty', 'admin'), getResultStatistics);

// Student routes
router.get('/student/my-results', protect, authorize('student'), getStudentResults);

export default router;
