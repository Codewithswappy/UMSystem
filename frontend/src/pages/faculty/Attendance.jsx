import { useState, useEffect } from "react";
import { Check, X, Clock, Calendar, Save, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

export default function FacultyAttendance() {
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [allStudents, setAllStudents] = useState([]); // Store all fetched students
  const [filteredStudents, setFilteredStudents] = useState([]); // Students for selected subject
  const [facultySubjects, setFacultySubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initial fetch of students and faculty subjects
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('🔑 Token:', token ? 'EXISTS' : 'MISSING');
        
        const response = await fetch('http://localhost:5000/api/attendance/my-students', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        console.log('═══════════════════════════════════════');
        console.log('📡 API Response from /api/faculty/my-students:');
        console.log('═══════════════════════════════════════');
        console.log('Success:', data.success);
        console.log('Students Count:', data.data?.length || 0);
        console.log('Faculty Subjects Count:', data.facultySubjects?.length || 0);
        console.log('\nFull Response:', JSON.stringify(data, null, 2));
        console.log('═══════════════════════════════════════\n');

        if (data.success) {
          console.log('✅ Setting allStudents:', data.data.length, 'students');
          console.log('✅ Setting facultySubjects:', data.facultySubjects.length, 'subjects');
          
          setAllStudents(data.data);
          setFacultySubjects(data.facultySubjects || []);
          
          // Select first subject by default if available
          if (data.facultySubjects && data.facultySubjects.length > 0) {
            const firstSubjectId = data.facultySubjects[0]._id;
            console.log('✅ Auto-selecting first subject:', firstSubjectId);
            setSelectedSubjectId(firstSubjectId);
          } else {
            console.log('⚠️  No faculty subjects available to select');
          }
        } else {
          console.error('❌ API returned success: false');
          console.error('Message:', data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch attendance status when subject or date changes
  useEffect(() => {
    if (!selectedSubjectId) {
      console.log('⚠️  No subject selected, skipping fetch');
      return;
    }

    const fetchAttendanceStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        console.log('\n🔍 FILTERING STUDENTS FOR SUBJECT:', selectedSubjectId);
        console.log('Total students to filter:', allStudents.length);
        
        // Filter students who have this subject
        const relevantStudents = allStudents.filter(student => {
          console.log(`\nChecking student: ${student.name}`);
          console.log('  Student subjects:', student.subjects.map(s => s._id || s));
          
          const hasSubject = student.subjects.some(sub => {
             const subId = sub._id || sub;
             const match = subId.toString() === selectedSubjectId;
             console.log(`  Comparing ${subId} === ${selectedSubjectId}: ${match}`);
             return match;
          });
          
          console.log(`  Has subject: ${hasSubject}`);
          return hasSubject;
        });

        console.log(`\n✅ Filtered ${relevantStudents.length} students for this subject`);
        relevantStudents.forEach(s => console.log(`  - ${s.name}`));

        // Fetch existing attendance for this subject and date
        const response = await fetch(`http://localhost:5000/api/attendance/class?subject=${selectedSubjectId}&date=${attendanceDate}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const attendanceData = await response.json();

        // Merge attendance status
        const mergedData = relevantStudents.map(student => {
          const existingRecord = (attendanceData.success && Array.isArray(attendanceData.data)) 
            ? attendanceData.data.find(r => r.student && r.student._id === student._id) 
            : null;
          return {
            ...student,
            status: existingRecord ? existingRecord.status : 'Present' // Default to Present
          };
        });

        console.log(`\n📊 Final merged data: ${mergedData.length} students`);
        setFilteredStudents(mergedData);
      } catch (error) {
        console.error("❌ Error fetching attendance status:", error);
      }
    };

    fetchAttendanceStatus();
  }, [selectedSubjectId, attendanceDate, allStudents]);

  const toggleStatus = (id, newStatus) => {
    setFilteredStudents(prev => 
      prev.map(s => s._id === id ? { ...s, status: newStatus } : s)
    );
  };

  const markAll = (status) => {
    setFilteredStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const saveAttendance = async () => {
    if (!selectedSubjectId) {
      alert("Please select a subject first.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const promises = filteredStudents.map(student => {
        return fetch('http://localhost:5000/api/attendance/mark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            studentId: student._id,
            status: student.status,
            subject: selectedSubjectId, // Send the selected subject ID
            date: attendanceDate,
            remarks: ''
          })
        });
      });

      await Promise.all(promises);
      alert('✅ Attendance saved successfully!');
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert('❌ Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const displayedStudents = filteredStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Mark and manage daily class attendance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="date" 
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-auto bg-white"
          />
          <Button 
            onClick={saveAttendance} 
            className="rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg"
            disabled={saving || !selectedSubjectId}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardHeader className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {facultySubjects.length > 0 ? (
              <select 
                className="bg-gray-50 border-none text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-2.5 font-bold min-w-[200px]"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                {facultySubjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-red-500 font-medium">No subjects assigned</div>
            )}
            
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100">
              {facultySubjects.find(s => s._id === selectedSubjectId)?.type || 'Class'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={() => markAll("Present")} className="rounded-lg text-xs">
              Mark All Present
            </Button>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search student..." 
                className="pl-9 h-9 bg-gray-50 border-none rounded-lg text-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">ID Number</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {displayedStudents.length > 0 ? (
                  displayedStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{student.studentId}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => toggleStatus(student._id, "Present")}
                            className={`p-2 rounded-lg transition-all ${
                              student.status === "Present" 
                                ? "bg-green-100 text-green-600 shadow-sm scale-110" 
                                : "text-gray-300 hover:bg-gray-100"
                            }`}
                            title="Present"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => toggleStatus(student._id, "Absent")}
                            className={`p-2 rounded-lg transition-all ${
                              student.status === "Absent" 
                                ? "bg-red-100 text-red-600 shadow-sm scale-110" 
                                : "text-gray-300 hover:bg-gray-100"
                            }`}
                            title="Absent"
                          >
                            <X className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => toggleStatus(student._id, "Late")}
                            className={`p-2 rounded-lg transition-all ${
                              student.status === "Late" 
                                ? "bg-yellow-100 text-yellow-600 shadow-sm scale-110" 
                                : "text-gray-300 hover:bg-gray-100"
                            }`}
                            title="Late"
                          >
                            <Clock className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === "Present" ? "bg-green-100 text-green-800" :
                          student.status === "Absent" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading students...' : 'No students found for this subject.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
