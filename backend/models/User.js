import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'faculty'],
        required: true
    },
    isApproved: {
        type: Boolean,
        default: function () {
            // Admin and faculty are auto-approved, students need approval
            return this.role !== 'student';
        }
    },
    mustChangePassword: {
        type: Boolean,
        default: false
    },
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
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

// Hash password before saving and update timestamp
// Hash password before saving and update timestamp
userSchema.pre('save', async function () {
    // Update timestamp
    this.updatedAt = Date.now();

    // Hash password if modified
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
