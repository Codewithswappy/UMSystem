import express from 'express';
import {
    getAllAnnouncements,
    createAnnouncement,
    deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public (or protected for all logged in users)
router.get('/', protect, getAllAnnouncements);

// Admin/Faculty only
router.post('/', protect, authorize('admin', 'faculty'), createAnnouncement);
router.delete('/:id', protect, authorize('admin', 'faculty'), deleteAnnouncement);

export default router;
