import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  X, 
  Calendar,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  MoreHorizontal,
  Clock
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import api, { applicationAPI } from "../../services/api";
import { cn } from "../../lib/utils";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editCourse, setEditCourse] = useState("");

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

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  useEffect(() => {
    if (selectedApp) {
      setEditDepartment(selectedApp.department || '');
      setEditCourse(selectedApp.course || '');
    }
  }, [selectedApp]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const statusFilter = filter === "all" ? null : filter;
      const response = await applicationAPI.getAll(statusFilter);
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!editDepartment || !editCourse) {
      alert("⚠️ Please assign both department and course before approving");
      return;
    }

    if (!window.confirm("Are you sure you want to approve this application?")) return;

    try {
      setActionLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const adminId = user?.adminId || user?._id;
      
      const response = await applicationAPI.approve(id, adminId, editDepartment, editCourse);
      if (response.success) {
        alert("✅ Application approved! Student account created and email sent.");
        fetchApplications();
        setShowDetails(false);
      }
    } catch (error) {
      console.error("Error approving application:", error);
      const errorMsg = error.message || error.error || "Failed to approve application";
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert("⚠️ Please provide a reason for rejection");
      return;
    }

    if (!window.confirm("Are you sure you want to reject this application?")) return;

    try {
      setActionLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const adminId = user?.adminId || user?._id;
      
      const response = await applicationAPI.reject(id, adminId, rejectionReason);
      if (response.success) {
        alert("✅ Application rejected and email sent");
        fetchApplications();
        setShowDetails(false);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      const errorMsg = error.message || error.error || "Failed to reject application";
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Rejected': return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Applications</h1>
          <p className="text-gray-500 mt-2">Manage and review student admission requests</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          {['all', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                filter === status 
                  ? "bg-black text-white shadow-md" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Content */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name, email, or ID..." 
            className="pl-11 bg-white border-gray-200 rounded-2xl h-12 shadow-sm focus:ring-2 focus:ring-black/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-gray-300 mb-4" />
            <p className="text-gray-400 font-medium">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No applications found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-4 pl-2">Applicant</div>
                  <div className="col-span-3">Program Info</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-100">
                  <AnimatePresence mode="popLayout">
                    {filteredApplications.map((app, index) => (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: index * 0.03 }}
                        layout
                        onClick={() => {
                          setSelectedApp(app);
                          setShowDetails(true);
                        }}
                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors cursor-pointer group"
                      >
                        {/* Applicant */}
                        <div className="col-span-4 flex items-center gap-4 pl-2">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm group-hover:bg-black group-hover:text-white transition-colors">
                            {app.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{app.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{app.email}</p>
                          </div>
                        </div>

                        {/* Program */}
                        <div className="col-span-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {app.department || 'Not Assigned'}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {app.course || 'Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit",
                            getStatusColor(app.status)
                          )}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </div>

                        {/* Action */}
                        <div className="col-span-1 flex justify-end pr-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-gray-900 transition-all">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      <AnimatePresence>
        {showDetails && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowDetails(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col md:flex-row"
            >
              {/* Sidebar Info */}
              <div className="w-full md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 flex flex-col">
                <div className="mb-8 text-center">
                  <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm text-3xl font-bold text-gray-900">
                    {selectedApp.name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedApp.name}</h2>
                  <p className="text-sm text-gray-500">{selectedApp.applicationId}</p>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{selectedApp.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedApp.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="line-clamp-2">{selectedApp.address}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Academic Info</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Previous Education</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.previousEducation || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Percentage/CGPA</p>
                        <p className="text-sm font-medium text-gray-900">{selectedApp.percentage || 'N/A'}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Application Status</h3>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 w-fit",
                      getStatusColor(selectedApp.status)
                    )}>
                      {getStatusIcon(selectedApp.status)}
                      {selectedApp.status}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)} className="rounded-full hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Requested Program
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Department</p>
                        <p className="font-medium text-gray-900">{selectedApp.department || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Course</p>
                        <p className="font-medium text-gray-900">{selectedApp.course || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {selectedApp.status === 'Pending' && (
                    <div className="space-y-6">
                      <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                        <h3 className="text-sm font-bold text-orange-900 mb-4">Action Required</h3>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-600">Assign Department *</label>
                              <select
                                value={editDepartment}
                                onChange={(e) => setEditDepartment(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none text-sm transition-all"
                              >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                  <option key={dept} value={dept}>{dept}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-gray-600">Assign Course *</label>
                              <select
                                value={editCourse}
                                onChange={(e) => setEditCourse(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 outline-none text-sm transition-all"
                              >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                  <option key={course} value={course}>{course}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <Button 
                            onClick={() => handleApprove(selectedApp._id)}
                            disabled={actionLoading || !editDepartment || !editCourse}
                            className="w-full bg-black hover:bg-gray-800 text-white rounded-xl h-12 font-semibold shadow-lg shadow-black/10"
                          >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Approve Application
                          </Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-3">Or reject application</p>
                        <div className="flex gap-3">
                          <Input 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="rounded-xl bg-gray-50 border-transparent focus:bg-white transition-all"
                          />
                          <Button 
                            onClick={() => handleReject(selectedApp._id)}
                            disabled={actionLoading}
                            variant="destructive"
                            className="rounded-xl px-6 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-none"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === 'Approved' && (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                      <h3 className="text-sm font-bold text-green-900 mb-4">Student Account Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          onClick={async () => {
                            if(!window.confirm('Resend approval email to student?')) return;
                            try {
                              setActionLoading(true);
                              const res = await api.post(`/applications/${selectedApp._id}/resend-email`);
                              if (res.data.tempPassword) {
                                  alert(`✅ Email resent!\n\n🔑 TEMP PASSWORD: ${res.data.tempPassword}`);
                              } else {
                                  alert('✅ Email resent successfully!');
                              }
                            } catch (err) {
                              alert('❌ Failed: ' + (err.response?.data?.error || err.message));
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                          disabled={actionLoading}
                          className="bg-white text-green-700 border border-green-200 hover:bg-green-50 rounded-xl h-11"
                        >
                          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                          Resend Credentials
                        </Button>

                        <Button 
                          onClick={async () => {
                            const newPassword = prompt("Enter a manual password:");
                            if (!newPassword) return;
                            try {
                              setActionLoading(true);
                              await api.post('/auth/admin/set-password', {
                                email: selectedApp.email,
                                password: newPassword
                              });
                              alert(`✅ Password set!\n\n👉 ${newPassword}`);
                            } catch (err) {
                              alert('❌ Failed: ' + (err.response?.data?.message || err.message));
                            } finally {
                              setActionLoading(false);
                            }
                          }}
                          disabled={actionLoading}
                          className="bg-white text-green-700 border border-green-200 hover:bg-green-50 rounded-xl h-11"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Set Manual Password
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedApp.status === 'Rejected' && selectedApp.rejectionReason && (
                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                      <h3 className="text-sm font-bold text-red-900 mb-2">Rejection Reason</h3>
                      <p className="text-red-700 text-sm">{selectedApp.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
