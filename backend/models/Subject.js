import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    credits: {
        type: Number,
        default: 3
    },
    type: {
        type: String,
        enum: ['Core', 'Elective', 'Lab', 'Project'],
        default: 'Core'
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    schedule: {
        type: String,
        trim: true
    },
    room: {
        type: String,
        trim: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    nextTopic: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
subjectSchema.index({ department: 1, course: 1, semester: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
