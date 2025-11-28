import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Lock, 
  Mail, 
  LogOut, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { adminAPI } from "../../services/api";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  // Admin Info State
  const [adminInfo, setAdminInfo] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: ""
  });

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Delete Account State
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const tabs = [
    { id: "profile", label: "Admin Info", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "logout", label: "Logout", icon: LogOut },
    { id: "delete", label: "Delete Account", icon: Trash2 }
  ];

  // Fetch admin data on component mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setFetchLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const adminId = user?.adminId || user?._id;
      const response = await adminAPI.getProfile(adminId);
      if (response.success) {
        setAdminInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      // Use default values if fetch fails
      setAdminInfo({
        name: "Admin User",
        email: "admin@university.edu",
        phone: "+1 234 567 8900",
        role: "Super Admin",
        department: "Administration"
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const adminId = user?.adminId || user?._id;
      const response = await adminAPI.updateProfile(adminId, {
        name: adminInfo.name,
        email: adminInfo.email,
        phone: adminInfo.phone,
        department: adminInfo.department
      });
      
      if (response.success) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const adminId = user?.adminId || user?._id;
      const response = await adminAPI.changePassword(adminId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        alert("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear any stored auth data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminId');
      // Redirect to home
      window.location.href = "/";
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      alert("Please type DELETE to confirm account deletion");
      return;
    }
    
    if (window.confirm("This action cannot be undone. Are you absolutely sure?")) {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        const adminId = user?.adminId || user?._id;
        const response = await adminAPI.deleteAccount(adminId);
        
        if (response.success) {
          alert("Account deleted successfully");
          localStorage.clear();
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert(error.message || "Failed to delete account. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-semibold text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-neutral-200 p-8"
          >
            {/* Admin Info Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-1">Admin Information</h2>
                  <p className="text-gray-500">Update your personal information</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={adminInfo.name}
                      onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={adminInfo.email}
                      onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={adminInfo.phone}
                      onChange={(e) => setAdminInfo({ ...adminInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={adminInfo.role}
                      disabled
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={adminInfo.department}
                      onChange={(e) => setAdminInfo({ ...adminInfo, department: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-1">Change Password</h2>
                  <p className="text-gray-500">Update your password to keep your account secure</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            )}

            {/* Logout Tab */}
            {activeTab === "logout" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-1">Logout</h2>
                  <p className="text-gray-500">Sign out of your account</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-semibold">Before you go</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Make sure you've saved all your work. You'll need to login again to access your account.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white hover:bg-red-700 rounded-xl py-6 font-semibold"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout from Account
                </Button>
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === "delete" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-red-600 mb-1">Delete Account</h2>
                  <p className="text-gray-500">Permanently delete your account and all data</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-900 font-semibold">Warning: This action cannot be undone!</p>
                    <p className="text-sm text-red-700 mt-1">
                      Deleting your account will permanently remove all your data, including:
                    </p>
                    <ul className="text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                      <li>Personal information and profile</li>
                      <li>All created announcements and records</li>
                      <li>Access to the admin dashboard</li>
                      <li>All associated data and history</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type <span className="text-red-600 font-bold">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE here"
                    className="w-full px-4 py-3 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE" || loading}
                  className={cn(
                    "w-full rounded-xl py-6 font-semibold",
                    deleteConfirmation === "DELETE" && !loading
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Trash2 className="w-5 h-5 mr-2" />}
                  {loading ? "Deleting..." : "Delete Account Permanently"}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
