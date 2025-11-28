import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    academicYear: {
        type: String,
        required: true,
        trim: true
    },
    // Marks breakdown
    internalMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 30
    },
    externalMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 70
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    // Grading
    grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', 'AB'],
        required: true
    },
    gradePoint: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    // Status
    status: {
        type: String,
        enum: ['Pass', 'Fail', 'Absent'],
        required: true
    },
    remarks: {
        type: String,
        trim: true
    },
    // Metadata
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    gradedAt: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index to ensure one result per student per subject per semester
resultSchema.index({ student: 1, subject: 1, semester: 1, academicYear: 1 }, { unique: true });

// Calculate grade and grade point based on total marks
resultSchema.methods.calculateGrade = function () {
    const marks = this.totalMarks;

    if (marks >= 90) {
        this.grade = 'A+';
        this.gradePoint = 10;
    } else if (marks >= 80) {
        this.grade = 'A';
        this.gradePoint = 9;
    } else if (marks >= 70) {
        this.grade = 'B+';
        this.gradePoint = 8;
    } else if (marks >= 60) {
        this.grade = 'B';
        this.gradePoint = 7;
    } else if (marks >= 50) {
        this.grade = 'C';
        this.gradePoint = 6;
    } else if (marks >= 40) {
        this.grade = 'D';
        this.gradePoint = 5;
    } else {
        this.grade = 'F';
        this.gradePoint = 0;
    }

    this.status = this.gradePoint >= 5 ? 'Pass' : 'Fail';
};

// Pre-save hook to calculate total marks and grade
resultSchema.pre('save', function (next) {
    this.totalMarks = this.internalMarks + this.externalMarks;
    this.calculateGrade();
    next();
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
