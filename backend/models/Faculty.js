import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
    facultyId: {
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
        required: [true, 'Department is required'],
        trim: true
    },
    course: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    qualification: {
        type: String,
        trim: true
    },
    experience: {
        type: Number, // in years
        min: 0
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    salary: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave', 'Retired'],
        default: 'Active'
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
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
facultySchema.pre('save', function () {
    this.updatedAt = Date.now();
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;
