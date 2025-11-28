import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, MapPin, Book, Calendar, Edit2, Camera, Save, X, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { studentAPI } from "../../services/api";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      console.log("Current User from LocalStorage:", user);

      // The student ID might be in user.student (if populated), user.studentId, or user._id depending on the structure
      // Based on authRoutes.js, it should be in user.student
      let studentId = user.student || user.studentId;

      // If student is an object (populated), get its _id
      if (typeof studentId === 'object' && studentId !== null) {
        studentId = studentId._id;
      }

      console.log("Resolved Student ID:", studentId);
      
      if (!studentId) {
        console.error("No student ID found in user object");
        setLoading(false);
        return;
      }

      const response = await studentAPI.getById(studentId);
      if (response.success) {
        setStudent(response.data);
        setFormData(response.data);
      } else {
        console.error("Failed to fetch student data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      
      // Only append allowed fields for update
      const allowedFields = ['name', 'phone', 'address', 'dateOfBirth'];
      
      allowedFields.forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      // Append file if selected
      if (selectedFile) {
        data.append('profilePicture', selectedFile);
      }

      const response = await studentAPI.update(student._id, data);
      
      if (response.success) {
        setStudent(response.data);
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewImage(null);
        // Update user in localStorage if needed (optional, mainly for name/pic)
        alert("✅ Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Student Profile Not Found</h2>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header / Cover */}
      <motion.div variants={itemVariants} className="relative">
        <div className="h-48 md:h-64 rounded-[2.5rem] bg-gradient-to-r from-orange-500 to-orange-400 overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="px-8 md:px-12 relative -mt-16 flex flex-col md:flex-row items-end md:items-end gap-6">
          <div className="relative group">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-xl relative">
              <img 
                src={previewImage || (student.profilePicture ? `http://localhost:5000/${student.profilePicture}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`)} 
                alt="Profile" 
                className="h-full w-full object-cover" 
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-8 w-8 text-white" />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            {!isEditing && (
              <Button size="icon" className="absolute bottom-2 right-2 rounded-full bg-black text-white hover:bg-gray-800 h-8 w-8 shadow-lg pointer-events-none">
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 pb-4 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-500 font-medium">{student.department} • {student.studentId}</p>
          </div>

          <div className="pb-4 w-full md:w-auto">
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(student);
                    setPreviewImage(null);
                    setSelectedFile(null);
                  }}
                  variant="outline"
                  className="rounded-xl border-gray-200"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-xl bg-black text-white hover:bg-gray-900 shadow-lg"
                >
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto rounded-xl bg-black text-white hover:bg-gray-900 shadow-lg"
              >
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Personal Info */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-orange-500" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                {isEditing ? (
                  <Input name="name" value={formData.name || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-900">{student.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                {isEditing ? (
                  <Input type="date" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl font-medium text-gray-900">
                    <Calendar className="h-4 w-4 text-gray-400" /> 
                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl font-medium text-gray-900">
                  <Mail className="h-4 w-4 text-gray-400" /> {student.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                {isEditing ? (
                  <Input name="phone" value={formData.phone || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl font-medium text-gray-900">
                    <Phone className="h-4 w-4 text-gray-400" /> {student.phone || 'N/A'}
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-500">Address</label>
                {isEditing ? (
                  <Input name="address" value={formData.address || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-200" />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl font-medium text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400" /> {student.address || 'N/A'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Book className="h-5 w-5 text-orange-500" /> Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Student ID</label>
                <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-900">{student.studentId}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Department</label>
                <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-900">{student.department}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Course</label>
                <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-900">{student.course || 'N/A'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Current Semester</label>
                <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-900">{student.semester || '1st Semester'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Enrollment Date</label>
                <div className="p-3 bg-gray-50 rounded-xl font-medium text-gray-900">
                  {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Stats */}
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-black text-white">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-orange-500 flex items-center justify-center mb-4 text-3xl font-bold">
                {student.gpa || '0.0'}
              </div>
              <h3 className="text-xl font-bold">Current GPA</h3>
              <p className="text-gray-400 text-sm mt-1">Keep up the good work!</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start rounded-xl h-12 border-gray-100 hover:bg-gray-50 hover:text-orange-500">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl h-12 border-gray-100 hover:bg-gray-50 hover:text-orange-500">
                Request ID Card
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl h-12 border-gray-100 hover:bg-gray-50 hover:text-orange-500">
                Download Transcript
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
