import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, BookOpen, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { API_BASE_URL } from '../../services/api';

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    course: '',
    semester: ''
  });

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    course: '',
    semester: 1,
    credits: 3,
    type: 'Core',
    description: ''
  });

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Arts'
  ];

  const courses = [
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
  ];
  const types = ['Core', 'Elective', 'Lab', 'Project'];

  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.course) queryParams.append('course', filters.course);
      if (filters.semester) queryParams.append('semester', filters.semester);

      const response = await fetch(`${API_BASE_URL}/subjects?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingSubject
        ? `${API_BASE_URL}/subjects/${editingSubject._id}`
        : `${API_BASE_URL}/subjects`;
      
      const response = await fetch(url, {
        method: editingSubject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert(`✅ Subject ${editingSubject ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
        resetForm();
        fetchSubjects();
      }
    } catch (error) {
      console.error('Error saving subject:', error);
      alert('❌ Failed to save subject');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Subject deleted successfully!');
        fetchSubjects();
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('❌ Failed to delete subject');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      department: subject.department,
      course: subject.course,
      semester: subject.semester,
      credits: subject.credits,
      type: subject.type,
      description: subject.description || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      department: '',
      course: '',
      semester: 1,
      credits: 3,
      type: 'Core',
      description: ''
    });
    setEditingSubject(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-500 mt-1">Create and manage subjects for all courses</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-xl bg-black text-white hover:bg-gray-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Department</Label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Course</Label>
              <select
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Semester</Label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({ department: '', course: '', semester: '' })}
                className="w-full rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects List */}
      <Card className="border-none shadow-sm rounded-[2rem] bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4 text-left">Code</th>
                  <th className="px-6 py-4 text-left">Subject Name</th>
                  <th className="px-6 py-4 text-left">Department</th>
                  <th className="px-6 py-4 text-left">Course</th>
                  <th className="px-6 py-4 text-center">Semester</th>
                  <th className="px-6 py-4 text-center">Credits</th>
                  <th className="px-6 py-4 text-center">Type</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-bold">{subject.code}</td>
                    <td className="px-6 py-4 font-medium">{subject.name}</td>
                    <td className="px-6 py-4 text-gray-500">{subject.department}</td>
                    <td className="px-6 py-4 text-gray-500">{subject.course}</td>
                    <td className="px-6 py-4 text-center">{subject.semester}</td>
                    <td className="px-6 py-4 text-center">{subject.credits}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant="outline"
                        className={`
                          ${subject.type === 'Core' ? 'bg-blue-50 text-blue-600 border-blue-100' : ''}
                          ${subject.type === 'Elective' ? 'bg-purple-50 text-purple-600 border-purple-100' : ''}
                          ${subject.type === 'Lab' ? 'bg-green-50 text-green-600 border-green-100' : ''}
                          ${subject.type === 'Project' ? 'bg-orange-50 text-orange-600 border-orange-100' : ''}
                        `}
                      >
                        {subject.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(subject)}
                          className="h-8 w-8 rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subject._id)}
                          className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subjects.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No subjects found. Create one to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Subject Code *</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., BCA101"
                    required
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Subject Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., C Programming"
                    required
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Department *</Label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Course *</Label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                    className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Semester *</Label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    required
                    className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Credits</Label>
                  <Input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    min="1"
                    max="10"
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Type *</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the subject..."
                    rows="3"
                    className="w-full mt-1 bg-gray-50 border-none rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-black text-white hover:bg-gray-800">
                  {editingSubject ? 'Update Subject' : 'Create Subject'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
