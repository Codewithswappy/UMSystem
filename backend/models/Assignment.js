import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        default: 100
    },
    attachments: [{
        filename: String,
        url: String
    }],
    status: {
        type: String,
        enum: ['Active', 'Closed'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
