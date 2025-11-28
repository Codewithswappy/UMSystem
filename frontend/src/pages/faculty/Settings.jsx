import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Lock, LogOut, ChevronRight, Mail, Phone, Building, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function FacultySettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      let facultyId = user.faculty || user.facultyId;

      if (typeof facultyId === 'object' && facultyId !== null) {
        facultyId = facultyId._id;
      }

      if (!facultyId) {
        console.error("No faculty ID found");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/faculty/${facultyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setFaculty(data.data);
      }
    } catch (error) {
      console.error("Error fetching faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "security", label: "Security & Privacy", icon: Lock },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300 mb-4" />
        <p className="text-gray-400 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your faculty profile and preferences.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-black text-white shadow-lg" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white min-h-[500px]">
                <CardContent className="p-8">
                  {activeTab === "profile" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="facultyId">Faculty ID</Label>
                            <div className="flex items-center gap-2 px-3 h-12 bg-gray-50 rounded-xl text-gray-500">
                              {faculty?.facultyId || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue={faculty?.name || ''} className="rounded-xl bg-gray-50 border-none h-12" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <div className="flex items-center gap-2 px-3 h-12 bg-gray-50 rounded-xl text-gray-500">
                              <Building className="h-4 w-4" /> {faculty?.department || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <div className="flex items-center gap-2 px-3 h-12 bg-gray-50 rounded-xl text-gray-500">
                              {faculty?.course || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex items-center gap-2 px-3 h-12 bg-gray-50 rounded-xl text-gray-500">
                              <Mail className="h-4 w-4" /> {faculty?.email || 'N/A'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" defaultValue={faculty?.phone || ''} className="rounded-xl bg-gray-50 border-none h-12" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="office">Office Location</Label>
                            <Input id="office" defaultValue={faculty?.officeLocation || ''} placeholder="Building, Room Number" className="rounded-xl bg-gray-50 border-none h-12" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="rounded-xl bg-black text-white hover:bg-gray-800 px-8 h-12">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeTab === "security" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-bold mb-6">Password & Security</h2>
                        <div className="space-y-6">
                          <Button variant="outline" className="w-full justify-between h-14 rounded-xl border-gray-200 hover:bg-gray-50">
                            <span className="font-bold">Change Password</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
