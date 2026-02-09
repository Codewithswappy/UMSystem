import Application from '../models/Application.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { sendApprovalEmail, sendRejectionEmail, generateTemporaryPassword } from '../utils/emailService.js';

// Get all applications
export const getAllApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const applications = await Application.find(filter)
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// Get single application
export const getApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('reviewedBy', 'name email');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
};

// Create application (for student registration)
export const createApplication = async (req, res) => {
    try {
        // Generate application ID
        const count = await Application.countDocuments();
        const applicationId = `APP${String(count + 1).padStart(6, '0')}`;

        const application = await Application.create({
            ...req.body,
            applicationId
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating application',
            error: error.message
        });
    }
};

// Approve application
export const approveApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Check if application is already processed
        if (application.status !== 'Pending') {
            // If approved but no user exists, allow retry (recovery mode)
            if (application.status === 'Approved') {
                const existingUser = await User.findOne({ email: application.email });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Application has already been approved and user account exists'
                    });
                }
                // If no user, continue to creation process...
                console.log('ℹ️ Application marked Approved but no User found. Retrying user creation...');
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Application has already been rejected'
                });
            }
        }

        // Update application status and assign department/course
        application.status = 'Approved';
        application.reviewedBy = req.body.adminId;
        application.reviewedDate = Date.now();

        // Update department and course if provided by admin
        if (req.body.department) {
            application.department = req.body.department;
        }
        if (req.body.course) {
            application.course = req.body.course;
        }

        await application.save();

        // Check if student already exists (in case of retry)
        let student = await Student.findOne({ email: application.email });

        if (!student) {
            // Create student record from application
            const studentCount = await Student.countDocuments();
            const studentId = `STU${String(studentCount + 1).padStart(5, '0')}`;

            student = await Student.create({
                studentId,
                name: application.name,
                email: application.email,
                phone: application.phone,
                dateOfBirth: application.dateOfBirth,
                gender: application.gender,
                address: application.address,
                department: application.department,
                course: application.course,
                semester: 1,
                status: 'Active'
            });
            console.log('✅ Student record created:', student.studentId);
        } else {
            console.log('ℹ️ Student record already exists:', student.studentId);
        }

        // Check if user already exists
        let user = await User.findOne({ email: application.email });

        if (!user) {
            // Generate temporary password
            const temporaryPassword = generateTemporaryPassword();

            // Create user account with temporary password
            user = new User({
                email: application.email,
                password: temporaryPassword,
                role: 'student',
                isApproved: true,
                mustChangePassword: true,
                applicationId: application._id,
                studentId: student._id
            });

            await user.save();

            console.log('✅ User account created successfully');
            console.log('📧 Preparing to send approval email...');

            // Send approval email with credentials
            const emailResult = await sendApprovalEmail(
                application.email,
                application.name,
                student.studentId,
                temporaryPassword
            );

            if (!emailResult.success) {
                console.error('⚠️ Email sending failed but approval succeeded');
                console.error('Email error:', emailResult.error);
            }

            res.status(200).json({
                success: true,
                message: emailResult.success
                    ? 'Application approved, student created, and email sent successfully'
                    : 'Application approved and student created, but email sending failed. Please check email configuration.',
                data: {
                    application,
                    student,
                    emailSent: emailResult.success,
                    emailError: emailResult.success ? null : emailResult.error
                }
            });
        } else {
            // User already exists
            console.log('ℹ️ User account already exists for email:', application.email);

            if (user.role === 'student') {
                // Generate new temporary password for re-approval
                const temporaryPassword = generateTemporaryPassword();
                
                // Update user with new temporary password
                user.password = temporaryPassword; // Will be hashed by pre-save hook
                user.mustChangePassword = true;
                user.isApproved = true;
                user.studentId = student._id;
                user.applicationId = application._id;
                
                await user.save();
                console.log('✅ Existing user account updated with new temporary password');

                // Send approval email with new credentials
                console.log('📧 Sending re-approval email...');
                const emailResult = await sendApprovalEmail(
                    application.email,
                    application.name,
                    student.studentId,
                    temporaryPassword
                );

                if (!emailResult.success) {
                    console.error('⚠️ Email sending failed for re-approval');
                }

                res.status(200).json({
                    success: true,
                    message: emailResult.success
                        ? 'Application approved, existing user credential reset, and email sent successfully'
                        : 'Application approved and user reset, but email sending failed. Please check email configuration.',
                    data: {
                        application,
                        student,
                        emailSent: emailResult.success,
                        emailError: emailResult.success ? null : emailResult.error
                    }
                });
            } else {
                // Non-student user exists with same email (e.g. Admin/Faculty)
                // We don't reset password, just ensure approval status if relevant
                user.isApproved = true;
                await user.save();
                
                console.log('⚠️ User exists with non-student role:', user.role);
                
                res.status(200).json({
                    success: true,
                    message: `Application approved. User already exists with role: ${user.role}. No email sent.`,
                    data: {
                        application,
                        student,
                        emailSent: false
                    }
                });
            }
        }
    } catch (error) {
        console.error('❌ Error approving application:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error approving application',
            error: error.message
        });
    }
};

// Reject application
export const rejectApplication = async (req, res) => {
    try {
        const { reason } = req.body;

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (application.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Application has already been reviewed'
            });
        }

        application.status = 'Rejected';
        application.reviewedBy = req.body.adminId;
        application.reviewedDate = Date.now();
        application.rejectionReason = reason;
        await application.save();

        // Send rejection email
        await sendRejectionEmail(application.email, application.name, reason);

        res.status(200).json({
            success: true,
            message: 'Application rejected and email sent successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting application',
            error: error.message
        });
    }
};

// Delete application
export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting application',
            error: error.message
        });
    }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
    try {
        const total = await Application.countDocuments();
        const pending = await Application.countDocuments({ status: 'Pending' });
        const approved = await Application.countDocuments({ status: 'Approved' });
        const rejected = await Application.countDocuments({ status: 'Rejected' });

        res.status(200).json({
            success: true,
            data: {
                total,
                pending,
                approved,
                rejected
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};
