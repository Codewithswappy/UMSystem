import express from 'express';
import {
    createAssignment,
    getFacultyAssignments,
    getAssignmentSubmissions,
    gradeSubmission,
    getStudentAssignments,
    submitAssignment,
    getSubmissionDetails
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../config/upload.js';

const router = express.Router();

// Faculty routes
router.post('/create', protect, authorize('faculty'), createAssignment);
router.get('/faculty/my-assignments', protect, authorize('faculty'), getFacultyAssignments);
router.get('/faculty/:assignmentId/submissions', protect, authorize('faculty'), getAssignmentSubmissions);
router.put('/faculty/grade/:submissionId', protect, authorize('faculty'), gradeSubmission);

// Student routes
router.get('/student/my-assignments', protect, authorize('student'), getStudentAssignments);
router.post('/student/submit/:assignmentId', protect, authorize('student'), upload.single('file'), submitAssignment);
router.get('/student/submission/:assignmentId', protect, authorize('student'), getSubmissionDetails);

export default router;
