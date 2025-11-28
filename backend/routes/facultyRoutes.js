import express from 'express';
import {
    getAllFaculty,
    getFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getFacultyStats,
    getDashboardData,
    getMyStudents
} from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Admin routes (protected by AdminLayout in frontend, but should be protected here too ideally)
router.get('/stats', getFacultyStats);
router.get('/', getAllFaculty);
router.post('/', createFaculty); // Admin creates faculty

// Protected Faculty Routes
router.get('/dashboard', protect, authorize('faculty'), getDashboardData);
router.get('/my-students', protect, authorize('faculty'), getMyStudents);

router.get('/:id', getFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

export default router;
