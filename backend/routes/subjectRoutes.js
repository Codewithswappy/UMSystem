import express from 'express';
import {
    getAllSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    assignSubjectsToStudent,
    autoAssignSubjects,
    assignSubjectsToFaculty,
    getSubjectsByCriteria
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Protected routes
router.get('/', protect, getAllSubjects);
router.get('/criteria', protect, getSubjectsByCriteria);
router.get('/:id', protect, getSubject);

// Admin only routes (and Faculty for management)
router.post('/', protect, authorize('admin', 'faculty'), createSubject);
router.put('/:id', protect, authorize('admin', 'faculty'), updateSubject);
router.delete('/:id', protect, authorize('admin'), deleteSubject);

// Assignment routes (Admin only)
router.post('/assign/student', protect, authorize('admin'), assignSubjectsToStudent);
router.post('/assign/auto', protect, authorize('admin'), autoAssignSubjects);
router.post('/assign/faculty', protect, authorize('admin'), assignSubjectsToFaculty);

export default router;
