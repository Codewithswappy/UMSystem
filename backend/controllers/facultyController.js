import Faculty from '../models/Faculty.js';

// Get all faculty
export const getAllFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: faculty.length,
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty',
            error: error.message
        });
    }
};

// Get single faculty
export const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty',
            error: error.message
        });
    }
};

// Create faculty
// Create faculty
export const createFaculty = async (req, res) => {
    try {
        console.log('👤 Create Faculty Request Received');
        console.log('   Body:', req.body);

        const { email, name } = req.body;

        // Check if faculty with email already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            console.log('❌ Faculty email already exists:', email);
            return res.status(400).json({
                success: false,
                message: 'Faculty with this email already exists'
            });
        }

        // Generate faculty ID
        const count = await Faculty.countDocuments();
        const facultyId = `FAC${String(count + 1).padStart(5, '0')}`;
        console.log('   Generated ID:', facultyId);

        // Create Faculty Record
        const faculty = await Faculty.create({
            ...req.body,
            facultyId
        });
        console.log('✅ Faculty record created');

        // Generate temporary password
        console.log('   Importing email service...');
        const { generateTemporaryPassword, sendFacultyCredentialsEmail } = await import('../utils/emailService.js');
        const temporaryPassword = generateTemporaryPassword();
        console.log('   Generated Temp Password');

        // Create User Account
        const User = (await import('../models/User.js')).default;

        // Check if user exists (shouldn't, but safe to check)
        let user = await User.findOne({ email });

        if (!user) {
            console.log('   Creating User account...');
            user = await User.create({
                email,
                password: temporaryPassword,
                role: 'faculty',
                isApproved: true,
                mustChangePassword: true,
                facultyId: faculty._id,
                name: name
            });
            console.log('✅ User account created');

            // Send Email
            console.log('📧 Calling sendFacultyCredentialsEmail...');
            const emailResult = await sendFacultyCredentialsEmail(email, name, facultyId, temporaryPassword);
            console.log('   Email Result:', emailResult);
        } else {
            console.log('⚠️ User account already exists for this email');
        }

        res.status(201).json({
            success: true,
            message: 'Faculty created and credentials sent successfully',
            data: faculty
        });
    } catch (error) {
        console.error('❌ Error creating faculty:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating faculty',
            error: error.message
        });
    }
};

// Update faculty
export const updateFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Faculty updated successfully',
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating faculty',
            error: error.message
        });
    }
};

// Delete faculty
export const deleteFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findByIdAndDelete(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Faculty deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting faculty',
            error: error.message
        });
    }
};

// Get faculty statistics
export const getFacultyStats = async (req, res) => {
    try {
        const totalFaculty = await Faculty.countDocuments();
        const activeFaculty = await Faculty.countDocuments({ status: 'Active' });
        const onLeave = await Faculty.countDocuments({ status: 'On Leave' });

        // Faculty by department
        const byDepartment = await Faculty.aggregate([
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
                total: totalFaculty,
                active: activeFaculty,
                onLeave,
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

// Get faculty dashboard data
export const getDashboardData = async (req, res) => {
    try {
        // req.user is set by auth middleware
        const userId = req.user.id;

        // Find faculty record associated with the user
        // We need to import User model to find the link
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId).populate({
            path: 'facultyId',
            populate: { path: 'subjects' }
        });

        if (!user || !user.facultyId) {
            return res.status(404).json({
                success: false,
                message: 'Faculty profile not found'
            });
        }

        const faculty = user.facultyId;
        const Student = (await import('../models/Student.js')).default;

        // Build query to filter by both department AND course
        const query = {};
        if (faculty.department) {
            query.department = faculty.department;
        }
        if (faculty.course) {
            query.course = faculty.course;
        }

        const facultyObj = faculty.toObject();

        // Calculate student count for each subject
        if (facultyObj.subjects && facultyObj.subjects.length > 0) {
            const subjectsWithCount = await Promise.all(facultyObj.subjects.map(async (subject) => {
                const count = await Student.countDocuments({ subjects: subject._id });
                return {
                    ...subject,
                    studentCount: count
                };
            }));
            facultyObj.subjects = subjectsWithCount;
        }

        // Get students matching department and course
        const students = await Student.find(query);
        const studentCount = students.length;

        // Get recent students (limit 5)
        const recentStudents = await Student.find(query)
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                profile: facultyObj,
                stats: {
                    totalStudents: studentCount,
                    department: faculty.department,
                    course: faculty.course,
                    classesToday: 0, // Placeholder for now
                    pendingGrading: 0 // Placeholder
                },
                recentStudents
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

// Get all students in faculty's department AND course
export const getMyStudents = async (req, res) => {
    try {
        const userId = req.user.id;
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId).populate('facultyId');

        if (!user || !user.facultyId) {
            return res.status(404).json({ success: false, message: 'Faculty profile not found' });
        }

        const faculty = user.facultyId;
        const Student = (await import('../models/Student.js')).default;

        // Filter students by BOTH department AND course
        const query = {};
        if (faculty.department) {
            query.department = faculty.department;
        }
        if (faculty.course) {
            query.course = faculty.course;
        }

        const students = await Student.find(query)
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
};
