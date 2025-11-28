import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true
    },
    previousEducation: {
        type: String,
        trim: true
    },
    percentage: {
        type: Number,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    reviewedDate: {
        type: Date
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    documents: [{
        name: String,
        url: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
applicationSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
