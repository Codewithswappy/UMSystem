import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Private (All roles)
export const getEvents = async (req, res) => {
    try {
        let query = {};

        // If user is a student, only show upcoming events
        // Assuming req.user is populated. If not, we might need to check how auth works.
        // The middleware 'protect' populates req.user.
        if (req.user && req.user.role === 'student') {
            query.date = { $gte: new Date() };
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Faculty/Admin)
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, type, image } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            type,
            image,
            organizer: req.user.id // Assuming req.user is populated by auth middleware
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Faculty/Admin)
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is authorized to delete (e.g., only organizer or admin)
        // For simplicity, allowing any faculty/admin for now

        await event.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
