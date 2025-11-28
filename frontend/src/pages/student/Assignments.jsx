import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Calendar,
  Award,
  User,
  BookOpen,
  X,
  ChevronRight,
  Paperclip
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitData, setSubmitData] = useState({
    remarks: "",
    file: null
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assignments/student/my-assignments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAssignments(data.data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!submitData.file) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', submitData.file);
      formData.append('remarks', submitData.remarks);

      const response = await fetch(`http://localhost:5000/api/assignments/student/submit/${selectedAssignment._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setShowSubmitModal(false);
        setSubmitData({ remarks: "", file: null });
        fetchAssignments();
      } else {
        alert(data.message || 'Failed to submit assignment');
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert('❌ Failed to submit assignment');
    }
  };

  const getStatusBadge = (submission) => {
    switch (submission.status) {
      case 'Submitted':
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-none font-medium">Submitted</Badge>;
      case 'Late':
        return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-none font-medium">Late Submission</Badge>;
      case 'Graded':
        return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none font-medium">Graded</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none font-medium">Pending</Badge>;
    }
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 animate-pulse">Loading assignments...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.submission.status === 'Pending').length,
    submitted: assignments.filter(a => ['Submitted', 'Late', 'Graded'].includes(a.submission.status)).length,
    graded: assignments.filter(a => a.submission.status === 'Graded').length
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assignments</h1>
          <p className="text-gray-500 mt-1">Manage your coursework and submissions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Assigned</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h3>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <BookOpen className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <h3 className="text-3xl font-bold text-orange-600 mt-1">{stats.pending}</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted</p>
                <h3 className="text-3xl font-bold text-green-600 mt-1">{stats.submitted}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Graded</p>
                <h3 className="text-3xl font-bold text-blue-600 mt-1">{stats.graded}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md uppercase">
                    {assignment.subject?.code}
                  </span>
                  {getStatusBadge(assignment.submission)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
                  {assignment.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due Date
                    </div>
                    <span className={`font-medium ${isOverdue(assignment.dueDate) && assignment.submission.status === 'Pending' ? 'text-red-600' : 'text-gray-700'}`}>
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      Faculty
                    </div>
                    <span className="font-medium text-gray-700 truncate max-w-[120px]">
                      {assignment.faculty?.name?.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                {assignment.submission.status === 'Pending' ? (
                  <Button 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-lg shadow-gray-200"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitModal(true);
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Work
                  </Button>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                      {assignment.submission.status === 'Graded' ? (
                        <span className="text-sm font-bold text-blue-600">
                          {assignment.submission.marksObtained} / {assignment.totalMarks}
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 font-medium flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" /> Submitted
                        </span>
                      )}
                    </div>
                    {assignment.submission.facultyRemarks && (
                      <p className="text-xs text-gray-600 italic border-t border-gray-200 pt-2 mt-2">
                        "{assignment.submission.facultyRemarks}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {assignments.length === 0 && !loading && (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No assignments found</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && selectedAssignment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Submit Assignment</h2>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Assignment</label>
                    <span className="text-xs text-gray-400">{selectedSubject?.name}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-gray-900 font-medium">{selectedAssignment?.title}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-orange-200 hover:bg-orange-50/50 transition-colors text-center cursor-pointer relative">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setSubmitData({ ...submitData, file: e.target.files[0] })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="p-3 bg-gray-50 rounded-full mb-3">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {submitData.file ? submitData.file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                  <textarea
                    value={submitData.remarks}
                    onChange={(e) => setSubmitData({ ...submitData, remarks: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                    placeholder="Add any comments for the faculty..."
                  />
                </div>

                {isOverdue(selectedAssignment?.dueDate) && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Late Submission Warning</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        This assignment is past its due date. It will be marked as late.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 shadow-lg shadow-orange-200">
                    Submit Assignment
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
