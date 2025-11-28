import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Loader2, X, Trash2, Edit2, BookOpen } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { facultyAPI } from "../../services/api";

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    course: "",
    designation: "",
    status: "Active"
  });
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedFacultyForSubjects, setSelectedFacultyForSubjects] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(false);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchSubjects = async (dept, course) => {
    try {
      setSubjectLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (dept) queryParams.append('department', dept);
      if (course) queryParams.append('course', course);
      
      const response = await fetch(`http://localhost:5000/api/subjects?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAvailableSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setSubjectLoading(false);
    }
  };

  const handleAssignSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/subjects/assign/faculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          facultyId: selectedFacultyForSubjects._id,
          subjectIds: selectedSubjectIds
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Subjects assigned successfully!');
        setShowSubjectModal(false);
        fetchFaculty(); // Refresh list
      } else {
        alert('❌ Failed to assign subjects: ' + data.message);
      }
    } catch (error) {
      console.error('Error assigning subjects:', error);
      alert('❌ Error assigning subjects');
    }
  };

  const openSubjectModal = (faculty) => {
    setSelectedFacultyForSubjects(faculty);
    setSelectedSubjectIds(faculty.subjects ? faculty.subjects.map(s => typeof s === 'object' ? s._id : s) : []);
    fetchSubjects(faculty.department, faculty.course);
    setShowSubjectModal(true);
  };

  const toggleSubjectSelection = (subjectId) => {
    setSelectedSubjectIds(prev => 
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await facultyAPI.getAll();
      if (response.success) {
        setFaculty(response.data);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaculty) {
        await facultyAPI.update(editingFaculty._id, formData);
      } else {
        await facultyAPI.create(formData);
      }
      fetchFaculty();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving faculty:", error);
      alert(error.message || "Failed to save faculty");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) return;
    try {
      await facultyAPI.delete(id);
      fetchFaculty();
    } catch (error) {
      console.error("Error deleting faculty:", error);
      alert("Failed to delete faculty");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      course: "",
      designation: "",
      status: "Active"
    });
    setEditingFaculty(null);
  };

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.facultyId && f.facultyId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Faculty</h1>
          <div className="flex gap-2 mt-4">
            <span className="px-4 py-1.5 bg-white rounded-full text-sm font-semibold shadow-sm text-gray-900 border border-gray-100">All Faculty</span>
          </div>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="rounded-full bg-black text-white hover:bg-gray-900 h-12 px-6 font-bold w-full md:w-auto"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Faculty
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold w-full md:w-auto">Faculty Directory</CardTitle>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search faculty..." 
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
              {filteredFaculty.map((f, index) => (
                <motion.div 
                  key={f._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Faculty Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                        {f.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{f.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{f.email}</p>
                      </div>
                    </div>

                    {/* ID, Department & Status */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">ID</span>
                        <span className="text-sm font-mono text-gray-900">{f.facultyId}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Department</span>
                        <span className="text-sm font-medium text-gray-900">{f.department}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex w-fit ${
                          f.status === 'Active' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-orange-50 text-orange-600'
                        }`}>
                          {f.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-white hover:shadow-sm"
                        title="Assign Subjects"
                        onClick={() => openSubjectModal(f)}
                      >
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-white hover:shadow-sm"
                        onClick={() => {
                          setEditingFaculty(f);
                          setFormData({
                            name: f.name,
                            email: f.email,
                            phone: f.phone || "",
                            department: f.department || "",
                            course: f.course || "",
                            designation: f.designation || "",
                            status: f.status
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
                        onClick={() => handleDelete(f._id)}
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
                <h2 className="text-xl font-bold">{editingFaculty ? 'Edit Faculty' : 'Add Faculty'}</h2>
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
                <div>
                  <label className="text-sm font-medium text-gray-700">Course</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Course</option>
                    <option value="BCA (Bachelor of Computer Applications)">BCA (Bachelor of Computer Applications)</option>
                    <option value="MCA (Master of Computer Applications)">MCA (Master of Computer Applications)</option>
                    <option value="B.Tech (Bachelor of Technology)">B.Tech (Bachelor of Technology)</option>
                    <option value="M.Tech (Master of Technology)">M.Tech (Master of Technology)</option>
                    <option value="BBA (Bachelor of Business Administration)">BBA (Bachelor of Business Administration)</option>
                    <option value="MBA (Master of Business Administration)">MBA (Master of Business Administration)</option>
                    <option value="B.Com (Bachelor of Commerce)">B.Com (Bachelor of Commerce)</option>
                    <option value="M.Com (Master of Commerce)">M.Com (Master of Commerce)</option>
                    <option value="BA (Bachelor of Arts)">BA (Bachelor of Arts)</option>
                    <option value="MA (Master of Arts)">MA (Master of Arts)</option>
                    <option value="BSc (Bachelor of Science)">BSc (Bachelor of Science)</option>
                    <option value="MSc (Master of Science)">MSc (Master of Science)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <Input 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Designation</label>
                    <Input 
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      className="mt-1"
                    />
                  </div>
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
                    <option value="On Leave">On Leave</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-900">
                    {editingFaculty ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subject Assignment Modal */}
      <AnimatePresence>
        {showSubjectModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                  <h2 className="text-xl font-bold">Assign Subjects</h2>
                  <p className="text-sm text-gray-500">
                    Assigning to: {selectedFacultyForSubjects?.name} ({selectedFacultyForSubjects?.department})
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSubjectModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 mb-6">
                {subjectLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : availableSubjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No subjects found for this faculty's department/course.
                    <br />
                    Please create subjects first.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableSubjects.map(subject => (
                      <div 
                        key={subject._id}
                        onClick={() => toggleSubjectSelection(subject._id)}
                        className={`
                          p-4 rounded-xl border cursor-pointer transition-all
                          ${selectedSubjectIds.includes(subject._id)
                            ? 'border-black bg-gray-50 ring-1 ring-black'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-5 h-5 rounded border flex items-center justify-center mt-0.5
                            ${selectedSubjectIds.includes(subject._id)
                              ? 'bg-black border-black text-white'
                              : 'border-gray-300 bg-white'
                            }
                          `}>
                            {selectedSubjectIds.includes(subject._id) && <X className="w-3 h-3 rotate-45" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900">{subject.name}</h4>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{subject.code}</p>
                            <div className="flex gap-2 mt-2">
                              <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                                Sem {subject.semester}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                                {subject.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 shrink-0 pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={() => setShowSubjectModal(false)}>Cancel</Button>
                <Button 
                  onClick={handleAssignSubjects}
                  className="bg-black text-white hover:bg-gray-900"
                  disabled={subjectLoading}
                >
                  Save Assignments ({selectedSubjectIds.length})
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
