import express from 'express';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

// Register Student (Application)
router.post('/register', async (req, res) => {
    try {
        console.log('📝 Registration attempt received');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const {
            name,
            email,
            phone,
            dateOfBirth,
            gender,
            address,
            department,
            course,
            previousEducation,
            percentage
        } = req.body;

        // Check if application already exists
        const existingApplication = await Application.findOne({ email });
        if (existingApplication) {
            console.log('❌ Application already exists for:', email);
            return res.status(400).json({
                success: false,
                message: 'Application already submitted with this email'
            });
        }

        // Generate application ID
        const applicationCount = await Application.countDocuments();
        const applicationId = `APP${String(applicationCount + 1).padStart(6, '0')}`;

        console.log('Creating application with ID:', applicationId);

        // Create application only (no user account yet)
        const application = new Application({
            applicationId,
            name,
            email,
            phone,
            dateOfBirth,
            gender,
            address,
            department,
            course,
            previousEducation,
            percentage,
            status: 'Pending'
        });

        await application.save();

        console.log('✅ Application created successfully:', applicationId);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! You will receive an email with login credentials once approved.',
            data: {
                applicationId: application.applicationId,
                email: application.email
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and role'
            });
        }

        // Find user
        const user = await User.findOne({ email, role })
            .populate('applicationId')
            .populate('studentId')
            .populate('facultyId')
            .populate('adminId');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if student is approved
        if (user.role === 'student' && !user.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your application is pending admin approval'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        // Prepare user data
        let userData = {
            _id: user._id,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved,
            mustChangePassword: user.mustChangePassword
        };

        if (user.role === 'student' && user.studentId) {
            userData.student = user.studentId._id;
        } else if (user.role === 'faculty' && user.facultyId) {
            userData.faculty = user.facultyId._id;
        } else if (user.role === 'admin' && user.adminId) {
            userData.admin = user.adminId._id;
        }

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: userData
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Check auth status
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Get user
        const user = await User.findById(decoded.userId)
            .select('-password')
            .populate('studentId')
            .populate('facultyId')
            .populate('adminId');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'User ID and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update password
        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
});

// Admin: Set Manual Password for User
router.post('/admin/set-password', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update password
        user.password = password; // Will be hashed by pre-save hook
        user.mustChangePassword = true; // Force them to change it
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully. Please share this password with the student.'
        });

    } catch (error) {
        console.error('Set password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting password',
            error: error.message
        });
    }
});

export default router;
