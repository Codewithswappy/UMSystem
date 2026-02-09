import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Save, Send, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { API_BASE_URL } from '../../services/api';

export default function FacultyGrading() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/faculty/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data && data.data.profile && data.data.profile.subjects) {
        setSubjects(data.data.profile.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSubject || !semester) {
      alert('Please select subject and semester');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/results/faculty/students?subjectId=${selectedSubject}&semester=${semester}&academicYear=${academicYear}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
        
        // Initialize grades from existing results
        const initialGrades = {};
        data.data.forEach(student => {
          if (student.result) {
            initialGrades[student._id] = {
              internalMarks: student.result.internalMarks,
              externalMarks: student.result.externalMarks,
              remarks: student.result.remarks || ''
            };
          } else {
            initialGrades[student._id] = {
              internalMarks: 0,
              externalMarks: 0,
              remarks: ''
            };
          }
        });
        setGrades(initialGrades);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = (studentId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: field === 'remarks' ? value : parseFloat(value) || 0
      }
    }));
  };

  const calculateTotal = (studentId) => {
    const grade = grades[studentId];
    if (!grade) return 0;
    return (grade.internalMarks || 0) + (grade.externalMarks || 0);
  };

  const calculateGrade = (total) => {
    if (total >= 90) return { grade: 'A+', point: 10, color: 'text-green-600' };
    if (total >= 80) return { grade: 'A', point: 9, color: 'text-green-500' };
    if (total >= 70) return { grade: 'B+', point: 8, color: 'text-blue-600' };
    if (total >= 60) return { grade: 'B', point: 7, color: 'text-blue-500' };
    if (total >= 50) return { grade: 'C', point: 6, color: 'text-yellow-600' };
    if (total >= 40) return { grade: 'D', point: 5, color: 'text-orange-600' };
    return { grade: 'F', point: 0, color: 'text-red-600' };
  };

  const saveGrades = async (publish = false) => {
    const gradesArray = students.map(student => ({
      studentId: student._id,
      subjectId: selectedSubject,
      semester: parseInt(semester),
      academicYear,
      internalMarks: grades[student._id]?.internalMarks || 0,
      externalMarks: grades[student._id]?.externalMarks || 0,
      remarks: grades[student._id]?.remarks || '',
      isPublished: publish
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/results/faculty/submit-grades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ grades: gradesArray })
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ ${publish ? 'Results published' : 'Grades saved'} successfully!`);
        fetchStudents(); // Refresh
      } else {
        alert('❌ Failed to save grades');
      }
    } catch (error) {
      console.error("Error saving grades:", error);
      alert('❌ Error saving grades');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Grade Students</h1>
        <p className="text-gray-600 mt-1">Enter marks and publish results</p>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full border rounded-xl p-3"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Academic Year</label>
              <Input
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={fetchStudents}
                className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl"
                disabled={!selectedSubject || !semester}
              >
                Load Students
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grading Table */}
      {students.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Students ({students.length})</span>
              <div className="flex gap-2">
                <Button
                  onClick={() => saveGrades(false)}
                  variant="outline"
                  className="rounded-xl"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={() => saveGrades(true)}
                  className="bg-green-600 hover:bg-green-700 rounded-xl"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish Results
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Student</th>
                    <th className="text-center p-3">Internal (30)</th>
                    <th className="text-center p-3">External (70)</th>
                    <th className="text-center p-3">Total</th>
                    <th className="text-center p-3">Grade</th>
                    <th className="text-left p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const total = calculateTotal(student._id);
                    const gradeInfo = calculateGrade(total);
                    
                    return (
                      <motion.tr
                        key={student._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.studentId}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            min="0"
                            max="30"
                            value={grades[student._id]?.internalMarks || 0}
                            onChange={(e) => updateGrade(student._id, 'internalMarks', e.target.value)}
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="p-3">
                          <Input
                            type="number"
                            min="0"
                            max="70"
                            value={grades[student._id]?.externalMarks || 0}
                            onChange={(e) => updateGrade(student._id, 'externalMarks', e.target.value)}
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-bold text-lg">{total}</span>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={`${gradeInfo.color} bg-transparent border-2`}>
                            {gradeInfo.grade}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Input
                            value={grades[student._id]?.remarks || ''}
                            onChange={(e) => updateGrade(student._id, 'remarks', e.target.value)}
                            placeholder="Optional remarks"
                            className="w-full"
                          />
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}

      {!loading && students.length === 0 && selectedSubject && semester && (
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No students found for this subject and semester</p>
        </div>
      )}
    </div>
  );
}
