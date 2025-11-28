import express from 'express';
const router = express.Router();
import { getEvents, createEvent, deleteEvent } from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getEvents)
    .post(protect, authorize('faculty', 'admin'), createEvent);

router.route('/:id')
    .delete(protect, authorize('faculty', 'admin'), deleteEvent);

export default router;
