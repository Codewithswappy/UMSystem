import express from 'express';
import {
    getAllApplications,
    getApplication,
    createApplication,
    approveApplication,
    rejectApplication,
    deleteApplication,
    getApplicationStats
} from '../controllers/applicationController.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { sendApprovalEmail, generateTemporaryPassword } from '../utils/emailService.js';

const router = express.Router();

router.get('/stats', getApplicationStats);
router.get('/', getAllApplications);
router.get('/:id', getApplication);
router.post('/', createApplication);
router.put('/:id/approve', approveApplication);
router.put('/:id/reject', rejectApplication);
router.delete('/:id', deleteApplication);

router.post('/:id/resend-email', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const student = await Student.findOne({ email: application.email });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Generate new temp password
        const temporaryPassword = generateTemporaryPassword();

        // Update user password
        const user = await User.findOne({ email: application.email });
        if (user) {
            user.password = temporaryPassword; // Will be hashed by pre-save hook
            user.mustChangePassword = true;
            await user.save();
        }

        const emailResult = await sendApprovalEmail(
            application.email,
            application.name,
            student.studentId,
            temporaryPassword
        );

        res.json({
            success: true,
            message: 'Email resent successfully',
            emailResult,
            // DEBUG: Return password to frontend so user can login if email fails
            tempPassword: temporaryPassword
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
