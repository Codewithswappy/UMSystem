import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { API_BASE_URL } from '../../services/api';

export default function StudentSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentId, setStudentId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "", // Note: Bio is not in the Student model, but we'll keep it in state for UI consistency if needed, or map it to something else. The model has address, department, etc. Let's stick to what's in the UI for now but map name correctly.
    address: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.student) {
          console.error("No student ID found");
          return;
        }
        setStudentId(user.student);

        const response = await fetch(`${API_BASE_URL}/students/${user.student}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
          const student = data.data;
          setFormData({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            address: student.address || "",
            // splitting name for UI if needed, but backend stores full name
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account preferences and settings.</p>

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
            <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm">
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
                        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name" 
                              value={formData.name} 
                              onChange={handleInputChange}
                              className="rounded-xl bg-gray-50 border-none h-12" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input 
                              id="address" 
                              value={formData.address} 
                              onChange={handleInputChange}
                              className="rounded-xl bg-gray-50 border-none h-12" 
                            />
                          </div>
                          {/* Removed Bio as it's not in schema, replaced with Address or just kept minimal */}
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              value={formData.email} 
                              disabled 
                              className="rounded-xl bg-gray-50 border-none h-12 opacity-70" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input 
                              id="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange}
                              className="rounded-xl bg-gray-50 border-none h-12" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSave}
                          disabled={saving}
                          className="rounded-xl bg-black text-white hover:bg-gray-800 px-8 h-12"
                        >
                          {saving ? "Saving..." : "Save Changes"}
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
                      
                      <div className="pt-6 border-t border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-red-600">Danger Zone</h2>
                        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                        <Button variant="destructive" className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none font-bold">
                          Delete Account
                        </Button>
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
