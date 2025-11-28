import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentId: {
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
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    address: {
        type: String,
        trim: true
    },
    department: {
        type: String,
        trim: true
    },
    course: {
        type: String,
        trim: true
    },
    semester: {
        type: Number,
        min: 1,
        max: 8
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Graduated', 'Suspended'],
        default: 'Active'
    },
    gpa: {
        type: Number,
        min: 0,
        max: 4
    },
    profilePicture: {
        type: String
    },
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
studentSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
