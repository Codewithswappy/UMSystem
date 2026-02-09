import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, Calendar, MoreHorizontal, ArrowRight, BookOpen, Plus, X, Save, Edit2, Trash2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { API_BASE_URL } from '../../services/api';

export default function FacultyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    course: "",
    semester: "",
    credits: 3,
    type: "Core",
    schedule: "",
    room: "",
    nextTopic: "",
    progress: 0
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/faculty/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && data.data.profile.subjects) {
        setClasses(data.data.profile.subjects);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      department: "",
      course: "",
      semester: "",
      credits: 3,
      type: "Core",
      schedule: "",
      room: "",
      nextTopic: "",
      progress: 0
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({
      name: cls.name || "",
      code: cls.code || "",
      department: cls.department || "",
      course: cls.course || "",
      semester: cls.semester || "",
      credits: cls.credits || 3,
      type: cls.type || "Core",
      schedule: cls.schedule || "",
      room: cls.room || "",
      nextTopic: cls.nextTopic || "",
      progress: cls.progress || 0
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Class created successfully!");
        setIsCreateModalOpen(false);
        fetchClasses(); // Refresh list
      } else {
        alert("Failed to create class: " + data.message);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subjects/${selectedClass._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Class updated successfully!");
        setIsEditModalOpen(false);
        fetchClasses(); // Refresh list
      } else {
        alert("Failed to update class: " + data.message);
      }
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Error updating class");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-500 mt-1">Manage your courses, students, and curriculum.</p>
        </div>
        <Button onClick={openCreateModal} className="rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Create New Class
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No classes assigned</h3>
          <p className="text-gray-500 mt-1">Create a new class to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((course, index) => (
            <motion.div key={course._id || index} variants={itemVariants} whileHover={{ y: -5 }}>
              <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full group cursor-pointer relative">
                <div className={`h-2 w-full bg-orange-500`} />
                <CardHeader className="p-6 pb-2 flex flex-row items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2 bg-gray-100 text-gray-600 hover:bg-gray-200">
                      {course.code}
                    </Badge>
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                      {course.name}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(course)} className="h-8 w-8 rounded-full -mr-2 text-gray-400 hover:text-black">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-4 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{course.studentCount || 0} Students Enrolled</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{course.schedule || "No schedule"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{course.room || "No room"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Next: <span className="font-medium text-gray-900">{course.nextTopic || "Not set"}</span></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-400">Course Progress</span>
                      <span className="text-gray-900">{course.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full bg-orange-500`} 
                      />
                    </div>
                  </div>

                  <Button onClick={() => openEditModal(course)} variant="outline" className="w-full rounded-xl border-gray-100 hover:bg-black hover:text-white hover:border-black transition-all group/btn">
                    Manage Class <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Class" onSubmit={handleCreate}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Course Name</Label>
            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Intro to CS" required />
          </div>
          <div className="space-y-2">
            <Label>Course Code</Label>
            <Input name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. CS101" required />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. Computer Science" required />
          </div>
          <div className="space-y-2">
            <Label>Course/Program</Label>
            <Input name="course" value={formData.course} onChange={handleInputChange} placeholder="e.g. B.Tech" required />
          </div>
          <div className="space-y-2">
            <Label>Semester</Label>
            <Input type="number" name="semester" value={formData.semester} onChange={handleInputChange} placeholder="1-8" required min="1" max="8" />
          </div>
          <div className="space-y-2">
            <Label>Credits</Label>
            <Input type="number" name="credits" value={formData.credits} onChange={handleInputChange} required min="1" />
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Input name="schedule" value={formData.schedule} onChange={handleInputChange} placeholder="e.g. Mon, Wed 9AM" />
          </div>
          <div className="space-y-2">
            <Label>Room</Label>
            <Input name="room" value={formData.room} onChange={handleInputChange} placeholder="e.g. Hall A" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Type</Label>
            <Select onValueChange={(val) => handleSelectChange("type", val)} defaultValue={formData.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Elective">Elective</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Manage Class" onSubmit={handleUpdate}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Course Name</Label>
            <Input name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Input name="schedule" value={formData.schedule} onChange={handleInputChange} placeholder="e.g. Mon, Wed 9AM" />
          </div>
          <div className="space-y-2">
            <Label>Room</Label>
            <Input name="room" value={formData.room} onChange={handleInputChange} placeholder="e.g. Hall A" />
          </div>
          <div className="space-y-2">
            <Label>Next Topic</Label>
            <Input name="nextTopic" value={formData.nextTopic} onChange={handleInputChange} placeholder="e.g. Arrays" />
          </div>
          <div className="space-y-2">
            <Label>Progress (%)</Label>
            <Input type="number" name="progress" value={formData.progress} onChange={handleInputChange} min="0" max="100" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800">
          Note: Core details like Code and Department should be managed by Admin.
        </div>
      </Modal>
    </motion.div>
  );
}

const Modal = ({ isOpen, onClose, title, onSubmit, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {children}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="rounded-xl bg-black text-white hover:bg-gray-800">
                <Save className="mr-2 h-4 w-4" /> Save Class
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
