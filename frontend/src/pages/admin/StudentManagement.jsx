import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Loader2, X, Trash2, Edit2, User, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { studentAPI } from "../../services/api";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    course: "",
    semester: 1,
    status: "Active"
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAll();
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent._id, formData);
      } else {
        await studentAPI.create(formData);
      }
      fetchStudents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving student:", error);
      alert(error.message || "Failed to save student");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await studentAPI.delete(id);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      course: "",
      semester: 1,
      status: "Active"
    });
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Students</h1>
          <div className="flex gap-2 mt-4">
            <span className="px-4 py-1.5 bg-white rounded-full text-sm font-semibold shadow-sm text-gray-900 border border-gray-100">All Students</span>
          </div>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="rounded-full bg-black text-white hover:bg-gray-900 h-12 px-6 font-bold w-full md:w-auto"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Student
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold w-full md:w-auto">All Students</CardTitle>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search students..." 
                className="pl-10 bg-gray-50 border-none rounded-xl h-10 focus-visible:ring-1 focus-visible:ring-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-gray-200 h-10 w-10 shrink-0">
              <Filter className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredStudents.map((student, index) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold shrink-0">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{student.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{student.email}</p>
                      </div>
                    </div>

                    {/* ID & Department */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">ID</span>
                        <span className="text-sm font-medium text-gray-900">#{student.studentId}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Department</span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 inline-flex w-fit">
                          {student.department}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-white hover:shadow-sm"
                        title="Auto Assign Subjects"
                        onClick={async () => {
                          if (!window.confirm(`Auto-assign subjects for ${student.name}?`)) return;
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch('http://localhost:5000/api/subjects/assign/auto', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ studentId: student._id })
                            });
                            const data = await response.json();
                            if (data.success) {
                              alert(data.message);
                            } else {
                              alert('Failed to assign subjects: ' + data.message);
                            }
                          } catch (error) {
                            console.error('Error assigning subjects:', error);
                            alert('Error assigning subjects');
                          }
                        }}
                      >
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-white hover:shadow-sm"
                        onClick={() => {
                          setEditingStudent(student);
                          setFormData({
                            name: student.name,
                            email: student.email,
                            phone: student.phone,
                            department: student.department,
                            course: student.course || "",
                            semester: student.semester,
                            status: student.status
                          });
                          setShowModal(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(student._id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      >
                        <option value="">Select Department</option>
                        {[
                          'Computer Science',
                          'Information Technology',
                          'Electronics',
                          'Mechanical Engineering',
                          'Civil Engineering',
                          'Business Administration',
                          'Commerce',
                          'Arts'
                        ].map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Course</label>
                      <select
                        value={formData.course}
                        onChange={(e) => setFormData({...formData, course: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      >
                        <option value="">Select Course</option>
                        {[
                          'BCA (Bachelor of Computer Applications)',
                          'MCA (Master of Computer Applications)',
                          'B.Tech (Bachelor of Technology)',
                          'M.Tech (Master of Technology)',
                          'BBA (Bachelor of Business Administration)',
                          'MBA (Master of Business Administration)',
                          'B.Com (Bachelor of Commerce)',
                          'M.Com (Master of Commerce)',
                          'BA (Bachelor of Arts)',
                          'MA (Master of Arts)',
                          'BSc (Bachelor of Science)',
                          'MSc (Master of Science)'
                        ].map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Semester</label>
                    <Input 
                      type="number"
                      min="1"
                      max="8"
                      value={formData.semester}
                      onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-900">
                    {editingStudent ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
