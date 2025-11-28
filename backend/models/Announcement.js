import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['General', 'Academic', 'Event', 'Urgent'],
        default: 'General'
    },
    audience: {
        type: String,
        enum: ['All', 'Students', 'Faculty', 'Staff'],
        default: 'All'
    },
    createdBy: {
        type: String, // Storing admin name directly for simplicity, or could be ObjectId
        default: 'Admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
