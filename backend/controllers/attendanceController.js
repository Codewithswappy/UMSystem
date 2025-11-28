import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

// Mark Attendance (Faculty)
export const markAttendance = async (req, res) => {
    try {
        const { studentId, status, subject, date, remarks } = req.body;
        const facultyId = req.user.facultyId; // From auth middleware

        console.log('=== MARKING ATTENDANCE ===');
        console.log('Request Body:', req.body);
        console.log('Faculty ID:', facultyId);
        console.log('Student ID:', studentId);
        console.log('Subject ID:', subject);

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            console.log('❌ Student not found:', studentId);
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        console.log('✅ Student found:', student.name);

        // Create or Update Attendance
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        console.log('Date range:', { startOfDay, endOfDay });

        const attendance = await Attendance.findOneAndUpdate(
            {
                student: studentId,
                subject: subject,
                date: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            },
            {
                student: studentId,
                faculty: facultyId,
                status: status,
                subject: subject,
                date: date,
                remarks: remarks
            },
            { new: true, upsert: true, runValidators: true }
        );

        console.log('✅ Attendance saved:', attendance);

        res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            data: attendance
        });
    } catch (error) {
        console.error('❌ Error marking attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking attendance',
            error: error.message
        });
    }
};

// Get Attendance for a Student (Student View)
export const getStudentAttendance = async (req, res) => {
    try {
        console.log('=== FETCHING STUDENT ATTENDANCE ===');
        console.log('User ID:', req.user.id);

        const userId = req.user.id;
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId);

        console.log('User found:', user ? user.email : 'Not found');
        console.log('Student ID from user:', user?.studentId);

        if (!user || !user.studentId) {
            console.log('❌ Student profile not found for user:', userId);
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // Fetch attendance and populate subject details
        const attendance = await Attendance.find({ student: user.studentId })
            .sort({ date: -1 })
            .populate('faculty', 'name')
            .populate('subject', 'name code');

        console.log('✅ Attendance records found:', attendance.length);
        console.log('Sample records:', attendance.slice(0, 3));

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        console.error('❌ Error fetching attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance',
            error: error.message
        });
    }
};

// Get Attendance for a Class (Faculty View)
export const getClassAttendance = async (req, res) => {
    try {
        const { subject, date } = req.query;

        const query = {};
        if (subject) query.subject = subject;

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const attendance = await Attendance.find(query)
            .populate('student', 'name studentId')
            .populate('subject', 'name code')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching class attendance',
            error: error.message
        });
    }
};

// Get students for faculty's assigned subjects
export const getMyStudentsForAttendance = async (req, res) => {
    try {
        console.log('\n═══════════════════════════════════════');
        console.log('📡 GET MY STUDENTS FOR ATTENDANCE');
        console.log('═══════════════════════════════════════');

        const facultyId = req.user.facultyId;
        console.log('Faculty ID from req.user:', facultyId);

        // Get faculty with populated subjects
        const faculty = await Faculty.findById(facultyId).populate('subjects');

        console.log('Faculty found:', faculty ? faculty.name : 'NOT FOUND');
        console.log('Faculty subjects (raw):', faculty ? faculty.subjects : 'N/A');
        console.log('Faculty subjects count:', faculty ? faculty.subjects.length : 0);

        if (faculty && faculty.subjects.length > 0) {
            console.log('Faculty subjects details:');
            faculty.subjects.forEach((s, i) => {
                console.log(`  ${i + 1}. ${s.code} - ${s.name} (${s._id})`);
            });
        }

        if (!faculty) {
            console.log('❌ Faculty not found!');
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        // Get all students who have at least one subject in common with faculty
        const facultySubjectIds = faculty.subjects.map(s => s._id);
        console.log('\nFaculty Subject IDs:', facultySubjectIds);

        const students = await Student.find({
            subjects: { $in: facultySubjectIds }
        }).populate('subjects', 'name code');

        console.log(`\nStudents found: ${students.length}`);
        students.forEach(s => console.log(`  - ${s.name} (${s.studentId})`));

        console.log('\n✅ Sending response...');
        console.log('═══════════════════════════════════════\n');

        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
            facultySubjects: faculty.subjects
        });
    } catch (error) {
        console.error('❌ Error in getMyStudentsForAttendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
};
