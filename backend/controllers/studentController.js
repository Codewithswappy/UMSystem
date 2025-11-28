import Student from '../models/Student.js';

// Get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
};

// Get single student
export const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('subjects');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Find faculty for each subject
        const Faculty = (await import('../models/Faculty.js')).default;
        const subjectsWithFaculty = await Promise.all(
            student.subjects.map(async (subject) => {
                const faculty = await Faculty.findOne({
                    subjects: subject._id
                }).select('name email designation');

                return {
                    ...subject.toObject(),
                    faculty: faculty || null
                };
            })
        );

        const studentData = student.toObject();
        studentData.subjects = subjectsWithFaculty;

        res.status(200).json({
            success: true,
            data: studentData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student',
            error: error.message
        });
    }
};

// Create student
export const createStudent = async (req, res) => {
    try {
        // Generate student ID
        const count = await Student.countDocuments();
        const studentId = `STU${String(count + 1).padStart(5, '0')}`;

        const student = await Student.create({
            ...req.body,
            studentId
        });

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating student',
            error: error.message
        });
    }
};

// Update student
export const updateStudent = async (req, res) => {
    try {
        console.log('Update Student Request:', req.params.id);
        console.log('Update Body:', req.body);
        console.log('Update File:', req.file);

        const updateData = { ...req.body };

        // Handle profile picture upload
        if (req.file) {
            updateData.profilePicture = req.file.path.replace(/\\/g, '/'); // Normalize path
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!student) {
            console.log('Student not found for update:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: student
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating student',
            error: error.message
        });
    }
};

// Delete student
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
};

// Get student statistics
export const getStudentStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const activeStudents = await Student.countDocuments({ status: 'Active' });
        const inactiveStudents = await Student.countDocuments({ status: 'Inactive' });

        // Students by department
        const byDepartment = await Student.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total: totalStudents,
                active: activeStudents,
                inactive: inactiveStudents,
                byDepartment
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};
