import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import Student from '../models/Student.js';

// Faculty: Create assignment
export const createAssignment = async (req, res) => {
    try {
        const { title, description, subject, dueDate, totalMarks } = req.body;
        const facultyId = req.user.facultyId;

        const assignment = await Assignment.create({
            title,
            description,
            subject,
            faculty: facultyId,
            dueDate,
            totalMarks: totalMarks || 100
        });

        // Create pending submissions for all students enrolled in this subject
        const students = await Student.find({ subjects: subject });

        const submissions = students.map(student => ({
            assignment: assignment._id,
            student: student._id,
            status: 'Pending'
        }));

        if (submissions.length > 0) {
            await Submission.insertMany(submissions);
        }

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: assignment
        });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating assignment',
            error: error.message
        });
    }
};

// Faculty: Get all assignments created by faculty
export const getFacultyAssignments = async (req, res) => {
    try {
        const facultyId = req.user.facultyId;

        const assignments = await Assignment.find({ faculty: facultyId })
            .populate('subject', 'name code')
            .sort({ createdAt: -1 });

        // Get submission stats for each assignment
        const assignmentsWithStats = await Promise.all(
            assignments.map(async (assignment) => {
                const submissions = await Submission.find({ assignment: assignment._id });
                const stats = {
                    total: submissions.length,
                    submitted: submissions.filter(s => s.status === 'Submitted' || s.status === 'Late' || s.status === 'Graded').length,
                    pending: submissions.filter(s => s.status === 'Pending').length,
                    graded: submissions.filter(s => s.status === 'Graded').length
                };

                return {
                    ...assignment.toObject(),
                    stats
                };
            })
        );

        res.status(200).json({
            success: true,
            count: assignmentsWithStats.length,
            data: assignmentsWithStats
        });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assignments',
            error: error.message
        });
    }
};

// Faculty: Get submissions for an assignment
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate('student', 'name studentId email')
            .populate('assignment', 'title totalMarks dueDate')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: error.message
        });
    }
};

// Faculty: Grade submission
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marksObtained, facultyRemarks } = req.body;

        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            {
                marksObtained,
                facultyRemarks,
                status: 'Graded',
                gradedAt: new Date()
            },
            { new: true }
        ).populate('student', 'name studentId');

        res.status(200).json({
            success: true,
            message: 'Submission graded successfully',
            data: submission
        });
    } catch (error) {
        console.error('Error grading submission:', error);
        res.status(500).json({
            success: false,
            message: 'Error grading submission',
            error: error.message
        });
    }
};

// Student: Get all assignments for student
export const getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user.studentId;

        // Get student's subjects
        const student = await Student.findById(studentId).select('subjects');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Get all assignments for student's subjects
        const assignments = await Assignment.find({
            subject: { $in: student.subjects }
        })
            .populate('subject', 'name code')
            .populate('faculty', 'name')
            .sort({ dueDate: 1 });

        // Get submission status for each assignment
        const assignmentsWithStatus = await Promise.all(
            assignments.map(async (assignment) => {
                const submission = await Submission.findOne({
                    assignment: assignment._id,
                    student: studentId
                });

                return {
                    ...assignment.toObject(),
                    submission: submission || { status: 'Pending' }
                };
            })
        );

        res.status(200).json({
            success: true,
            count: assignmentsWithStatus.length,
            data: assignmentsWithStatus
        });
    } catch (error) {
        console.error('Error fetching student assignments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assignments',
            error: error.message
        });
    }
};

// Student: Submit assignment with file upload
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { remarks } = req.body;
        const studentId = req.user.studentId;

        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Check if late
        const isLate = new Date() > new Date(assignment.dueDate);
        const status = isLate ? 'Late' : 'Submitted';

        const submission = await Submission.findOneAndUpdate(
            { assignment: assignmentId, student: studentId },
            {
                submittedFile: {
                    filename: req.file.originalname,
                    url: `/uploads/assignments/${req.file.filename}`,
                    uploadedAt: new Date()
                },
                remarks,
                status,
                submittedAt: new Date()
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: `Assignment ${isLate ? 'submitted late' : 'submitted successfully'}`,
            data: submission
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting assignment',
            error: error.message
        });
    }
};

// Student: Get submission details
export const getSubmissionDetails = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const studentId = req.user.studentId;

        const submission = await Submission.findOne({
            assignment: assignmentId,
            student: studentId
        })
            .populate('assignment')
            .populate({
                path: 'assignment',
                populate: { path: 'subject faculty' }
            });

        res.status(200).json({
            success: true,
            data: submission
        });
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submission',
            error: error.message
        });
    }
};
