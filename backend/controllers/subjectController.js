import Subject from '../models/Subject.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

// Get all subjects
export const getAllSubjects = async (req, res) => {
    try {
        const { department, course, semester } = req.query;

        const filter = {};
        if (department) filter.department = department;
        if (course) filter.course = course;
        if (semester) filter.semester = parseInt(semester);

        const subjects = await Subject.find(filter).sort({ semester: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subjects',
            error: error.message
        });
    }
};

// Get single subject
export const getSubject = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subject',
            error: error.message
        });
    }
};

// Create subject (Admin only)
// Create subject (Admin and Faculty)
export const createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);

        // If creator is faculty, assign the subject to them
        if (req.user && req.user.role === 'faculty') {
            const User = (await import('../models/User.js')).default;
            const user = await User.findById(req.user.id);

            if (user && user.facultyId) {
                await Faculty.findByIdAndUpdate(
                    user.facultyId,
                    { $addToSet: { subjects: subject._id } }
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating subject',
            error: error.message
        });
    }
};

// Update subject (Admin only)
export const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating subject',
            error: error.message
        });
    }
};

// Delete subject (Admin only)
export const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting subject',
            error: error.message
        });
    }
};

// Assign subjects to student (Admin only)
export const assignSubjectsToStudent = async (req, res) => {
    try {
        const { studentId, subjectIds } = req.body;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { subjects: subjectIds },
            { new: true }
        ).populate('subjects');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subjects assigned to student successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning subjects',
            error: error.message
        });
    }
};

// Auto-assign subjects based on student's course, department, and semester
export const autoAssignSubjects = async (req, res) => {
    try {
        const { studentId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Find all subjects matching student's course, department, and semester
        const query = {
            department: student.department,
            course: student.course,
            semester: student.semester,
            type: { $ne: 'Elective' }, // Exclude electives (admin assigns manually)
            isActive: true
        };

        console.log('=== AUTO ASSIGN DEBUG ===');
        console.log('Student:', {
            id: student._id,
            name: student.name,
            dept: student.department,
            course: student.course,
            sem: student.semester
        });
        console.log('Query:', query);

        const subjects = await Subject.find(query);

        console.log('Found subjects:', subjects.length);
        if (subjects.length === 0) {
            // Check if any subjects exist for this dept/course ignoring semester
            const anySubjects = await Subject.countDocuments({
                department: student.department,
                course: student.course
            });
            console.log(`Total subjects for ${student.course} in ${student.department}: ${anySubjects}`);
        }

        student.subjects = subjects.map(s => s._id);
        await student.save();

        await student.populate('subjects');

        res.status(200).json({
            success: true,
            message: `Auto-assigned ${subjects.length} subjects to student`,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error auto-assigning subjects',
            error: error.message
        });
    }
};

// Assign subjects to faculty (Admin only)
export const assignSubjectsToFaculty = async (req, res) => {
    try {
        const { facultyId, subjectIds } = req.body;

        const faculty = await Faculty.findByIdAndUpdate(
            facultyId,
            { subjects: subjectIds },
            { new: true }
        ).populate('subjects');

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subjects assigned to faculty successfully',
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error assigning subjects',
            error: error.message
        });
    }
};

// Get subjects by course/department/semester (for dropdowns)
export const getSubjectsByCriteria = async (req, res) => {
    try {
        const { department, course, semester } = req.query;

        if (!department || !course || !semester) {
            return res.status(400).json({
                success: false,
                message: 'Department, course, and semester are required'
            });
        }

        const subjects = await Subject.find({
            department,
            course,
            semester: parseInt(semester),
            isActive: true
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subjects',
            error: error.message
        });
    }
};
