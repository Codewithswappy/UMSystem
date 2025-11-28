import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    submittedFile: {
        filename: String,
        url: String,
        uploadedAt: Date
    },
    remarks: {
        type: String,
        trim: true
    },
    marksObtained: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Late', 'Graded'],
        default: 'Pending'
    },
    submittedAt: {
        type: Date
    },
    gradedAt: {
        type: Date
    },
    facultyRemarks: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
