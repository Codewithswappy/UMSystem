import Result from '../models/Result.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';

// Faculty: Get students for grading (by subject and semester)
export const getStudentsForGrading = async (req, res) => {
    try {
        const { subjectId, semester, academicYear } = req.query;
        const facultyId = req.user.facultyId;

        if (!subjectId || !semester || !academicYear) {
            return res.status(400).json({
                success: false,
                message: 'Subject, semester, and academic year are required'
            });
        }

        // Get all students enrolled in this subject and semester
        const students = await Student.find({
            subjects: subjectId,
            semester: parseInt(semester)
        }).select('studentId name email');

        // Get existing results for these students
        const studentIds = students.map(s => s._id);
        const existingResults = await Result.find({
            student: { $in: studentIds },
            subject: subjectId,
            semester: parseInt(semester),
            academicYear
        });

        // Map results to students
        const studentsWithResults = students.map(student => {
            const result = existingResults.find(r => r.student.toString() === student._id.toString());
            return {
                ...student.toObject(),
                result: result || null
            };
        });

        res.status(200).json({
            success: true,
            count: studentsWithResults.length,
            data: studentsWithResults
        });
    } catch (error) {
        console.error('Error fetching students for grading:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
};

// Faculty: Submit/Update grades
export const submitGrades = async (req, res) => {
    try {
        const { grades } = req.body; // Array of { studentId, subjectId, semester, academicYear, internalMarks, externalMarks, remarks }
        const facultyId = req.user.facultyId;

        if (!grades || !Array.isArray(grades) || grades.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Grades array is required'
            });
        }

        const results = [];
        const errors = [];

        for (const gradeData of grades) {
            try {
                const { studentId, subjectId, semester, academicYear, internalMarks, externalMarks, remarks, isPublished } = gradeData;

                // Validate marks
                if (internalMarks < 0 || internalMarks > 30) {
                    errors.push({ studentId, error: 'Internal marks must be between 0 and 30' });
                    continue;
                }
                if (externalMarks < 0 || externalMarks > 70) {
                    errors.push({ studentId, error: 'External marks must be between 0 and 70' });
                    continue;
                }

                // Calculate total marks
                const totalMarks = internalMarks + externalMarks;

                // Calculate grade and grade point
                let grade, gradePoint, status;
                if (totalMarks >= 90) {
                    grade = 'A+';
                    gradePoint = 10;
                } else if (totalMarks >= 80) {
                    grade = 'A';
                    gradePoint = 9;
                } else if (totalMarks >= 70) {
                    grade = 'B+';
                    gradePoint = 8;
                } else if (totalMarks >= 60) {
                    grade = 'B';
                    gradePoint = 7;
                } else if (totalMarks >= 50) {
                    grade = 'C';
                    gradePoint = 6;
                } else if (totalMarks >= 40) {
                    grade = 'D';
                    gradePoint = 5;
                } else {
                    grade = 'F';
                    gradePoint = 0;
                }

                status = gradePoint >= 5 ? 'Pass' : 'Fail';

                // Update or create result
                const result = await Result.findOneAndUpdate(
                    {
                        student: studentId,
                        subject: subjectId,
                        semester,
                        academicYear
                    },
                    {
                        internalMarks,
                        externalMarks,
                        totalMarks,
                        grade,
                        gradePoint,
                        status,
                        remarks,
                        gradedBy: facultyId,
                        gradedAt: new Date(),
                        isPublished: isPublished || false
                    },
                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }
                );

                results.push(result);
            } catch (err) {
                errors.push({ studentId: gradeData.studentId, error: err.message });
            }
        }

        res.status(200).json({
            success: true,
            message: `${results.length} grades saved successfully`,
            data: results,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('Error submitting grades:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting grades',
            error: error.message
        });
    }
};

// Faculty: Publish results
export const publishResults = async (req, res) => {
    try {
        const { subjectId, semester, academicYear } = req.body;

        const result = await Result.updateMany(
            {
                subject: subjectId,
                semester,
                academicYear,
                isPublished: false
            },
            {
                isPublished: true
            }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} results published successfully`
        });
    } catch (error) {
        console.error('Error publishing results:', error);
        res.status(500).json({
            success: false,
            message: 'Error publishing results',
            error: error.message
        });
    }
};

// Student: Get own results
export const getStudentResults = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const { semester } = req.query;

        const query = {
            student: studentId,
            isPublished: true
        };

        if (semester) {
            query.semester = parseInt(semester);
        }

        const results = await Result.find(query)
            .populate('subject', 'name code credits type')
            .populate('gradedBy', 'name')
            .sort({ semester: 1, 'subject.name': 1 });

        // Calculate GPA for each semester
        const semesterResults = {};
        results.forEach(result => {
            if (!semesterResults[result.semester]) {
                semesterResults[result.semester] = {
                    semester: result.semester,
                    results: [],
                    totalCredits: 0,
                    earnedCredits: 0,
                    totalGradePoints: 0
                };
            }

            semesterResults[result.semester].results.push(result);
            const credits = result.subject.credits || 3;
            semesterResults[result.semester].totalCredits += credits;

            if (result.status === 'Pass') {
                semesterResults[result.semester].earnedCredits += credits;
            }

            semesterResults[result.semester].totalGradePoints += result.gradePoint * credits;
        });

        // Calculate SGPA for each semester
        Object.values(semesterResults).forEach(sem => {
            sem.sgpa = sem.totalCredits > 0
                ? (sem.totalGradePoints / sem.totalCredits).toFixed(2)
                : 0;
        });

        // Calculate overall CGPA
        let totalCredits = 0;
        let totalGradePoints = 0;
        results.forEach(result => {
            const credits = result.subject.credits || 3;
            totalCredits += credits;
            totalGradePoints += result.gradePoint * credits;
        });

        const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

        res.status(200).json({
            success: true,
            data: {
                results,
                semesterResults: Object.values(semesterResults),
                cgpa,
                totalCredits,
                earnedCredits: results.filter(r => r.status === 'Pass').reduce((sum, r) => sum + (r.subject.credits || 3), 0)
            }
        });
    } catch (error) {
        console.error('Error fetching student results:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching results',
            error: error.message
        });
    }
};

// Get result statistics (for analytics)
export const getResultStatistics = async (req, res) => {
    try {
        const { subjectId, semester, academicYear } = req.query;

        const results = await Result.find({
            subject: subjectId,
            semester: parseInt(semester),
            academicYear,
            isPublished: true
        });

        const stats = {
            total: results.length,
            pass: results.filter(r => r.status === 'Pass').length,
            fail: results.filter(r => r.status === 'Fail').length,
            absent: results.filter(r => r.status === 'Absent').length,
            averageMarks: results.length > 0
                ? (results.reduce((sum, r) => sum + r.totalMarks, 0) / results.length).toFixed(2)
                : 0,
            highestMarks: results.length > 0
                ? Math.max(...results.map(r => r.totalMarks))
                : 0,
            lowestMarks: results.length > 0
                ? Math.min(...results.map(r => r.totalMarks))
                : 0,
            gradeDistribution: {
                'A+': results.filter(r => r.grade === 'A+').length,
                'A': results.filter(r => r.grade === 'A').length,
                'B+': results.filter(r => r.grade === 'B+').length,
                'B': results.filter(r => r.grade === 'B').length,
                'C': results.filter(r => r.grade === 'C').length,
                'D': results.filter(r => r.grade === 'D').length,
                'F': results.filter(r => r.grade === 'F').length
            }
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};
