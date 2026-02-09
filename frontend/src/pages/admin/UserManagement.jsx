import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Shield, User, Loader2, X, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { adminAPI } from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
    department: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllAdmins();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createAdmin(formData);
      fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminAPI.deleteAccount(id);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Admin",
      department: ""
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <div className="flex gap-2 mt-4">
            <span className="px-4 py-1.5 bg-white rounded-full text-sm font-semibold shadow-sm text-gray-900 border border-gray-100">All Users</span>
          </div>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="rounded-full bg-black text-white hover:bg-gray-900 h-12 px-6 font-bold w-full md:w-auto"
        >
          <Plus className="mr-2 h-5 w-5" /> Add User
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold w-full md:w-auto">System Users</CardTitle>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search users..." 
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
              {filteredUsers.map((user, index) => (
                <motion.div 
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{user.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Role & Department */}
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Role</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center w-fit gap-1 ${
                          user.role === 'Super Admin' ? 'bg-purple-50 text-purple-600' :
                          user.role === 'Admin' ? 'bg-blue-50 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Shield className="h-3 w-3" />
                          {user.role}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Department</span>
                        <span className="text-sm font-medium text-gray-900">{user.department || '-'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
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
                <h2 className="text-xl font-bold">Add New User</h2>
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
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Input 
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <Input 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-900">
                    Create User
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
