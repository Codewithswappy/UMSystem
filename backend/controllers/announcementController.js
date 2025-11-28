import Announcement from '../models/Announcement.js';

// Get all announcements (filtered by user role)
export const getAllAnnouncements = async (req, res) => {
    try {
        const userRole = req.user?.role; // Get user role from auth middleware

        let query = { isActive: true };

        // Filter announcements based on user role
        if (userRole === 'student') {
            // Students see announcements for 'All' and 'Students'
            query.audience = { $in: ['All', 'Students'] };
        } else if (userRole === 'faculty') {
            // Faculty see announcements for 'All' and 'Faculty'
            query.audience = { $in: ['All', 'Faculty'] };
        }
        // Admin sees all announcements (no additional filter needed)

        const announcements = await Announcement.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching announcements',
            error: error.message
        });
    }
};

// Create announcement
export const createAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating announcement',
            error: error.message
        });
    }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting announcement',
            error: error.message
        });
    }
};
