import Admin from '../models/Admin.js';

// Get admin profile
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching admin profile',
            error: error.message
        });
    }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
    try {
        const { name, email, phone, department } = req.body;

        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        if (department) admin.department = department;

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        const admin = await Admin.findById(req.params.id).select('+password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Check current password
        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// Delete admin account
export const deleteAdminAccount = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        await Admin.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        });
    }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ isActive: true });

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching admins',
            error: error.message
        });
    }
};

// Create admin (for initial setup)
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, phone, role, department } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
            phone,
            role,
            department
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating admin',
            error: error.message
        });
    }
};
