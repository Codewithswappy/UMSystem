import express from 'express';
const router = express.Router();
import { getMyFees, createFee, payFee, getAllFees } from '../controllers/feeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.route('/')
    .post(protect, authorize('admin'), createFee)
    .get(protect, authorize('admin'), getAllFees);

router.route('/myfees')
    .get(protect, authorize('student'), getMyFees);

router.route('/:id/pay')
    .put(protect, authorize('student'), payFee);

export default router;
