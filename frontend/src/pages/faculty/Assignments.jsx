import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Award,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    totalMarks: 100
  });

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assignments/faculty/my-assignments', {
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

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/faculty/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Faculty Dashboard Data:', data); // Debug log
      if (data.success && data.data && data.data.profile && data.data.profile.subjects) {
        setSubjects(data.data.profile.subjects);
        console.log('Subjects loaded:', data.data.profile.subjects); // Debug log
      } else {
        console.log('No subjects found in response');
        console.log('Response structure:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assignments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Assignment created successfully!');
        setShowCreateModal(false);
        setFormData({ title: "", description: "", subject: "", dueDate: "", totalMarks: 100 });
        fetchAssignments();
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert('❌ Failed to create assignment');
    }
  };

  const viewSubmissions = async (assignment) => {
    setSelectedAssignment(assignment);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/assignments/faculty/${assignment._id}/submissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
        setShowSubmissionsModal(true);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const gradeSubmission = async (submissionId, marks, remarks) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/assignments/faculty/grade/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ marksObtained: marks, facultyRemarks: remarks })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Submission graded successfully!');
        viewSubmissions(selectedAssignment);
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      alert('❌ Failed to grade submission');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-green-100 text-green-700';
      case 'Late': return 'bg-yellow-100 text-yellow-700';
      case 'Graded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{assignment.subject?.name}</p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 border-none">
                    {assignment.subject?.code}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Total</p>
                    <p className="text-lg font-bold text-blue-600">{assignment.stats?.total || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Submitted</p>
                    <p className="text-lg font-bold text-green-600">{assignment.stats?.submitted || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Graded</p>
                    <p className="text-lg font-bold text-purple-600">{assignment.stats?.graded || 0}</p>
                  </div>
                </div>

                <Button
                  onClick={() => viewSubmissions(assignment)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Submissions
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {assignments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assignments created yet</p>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Create New Assignment</h2>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full border rounded-xl p-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full border rounded-xl p-3"
                    >
                      <option value="">Select Subject</option>
                      {console.log('Rendering subjects dropdown, count:', subjects.length)}
                      {subjects.map(subject => {
                        console.log('Subject:', subject);
                        return (
                          <option key={subject._id} value={subject._id}>
                            {subject.code} - {subject.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Total Marks</label>
                  <Input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-xl">
                    Create Assignment
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submissions Modal */}
      <AnimatePresence>
        {showSubmissionsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSubmissionsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <h2 className="text-2xl font-bold mb-6">{selectedAssignment?.title} - Submissions</h2>
              
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission._id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold">{submission.student?.name}</h3>
                          <p className="text-sm text-gray-500">{submission.student?.studentId}</p>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                      </div>

                      {submission.status !== 'Pending' && (
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          {submission.submittedFile && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <a
                                href={`http://localhost:5000${submission.submittedFile.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                📎 {submission.submittedFile.filename}
                              </a>
                            </div>
                          )}
                          {submission.remarks && (
                            <p className="text-sm"><strong>Student Remarks:</strong> {submission.remarks}</p>
                          )}
                        </div>
                      )}

                      {submission.status === 'Graded' ? (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="font-bold text-blue-900">
                            Marks: {submission.marksObtained}/{selectedAssignment.totalMarks}
                          </p>
                          {submission.facultyRemarks && (
                            <p className="text-sm text-blue-700 mt-2">{submission.facultyRemarks}</p>
                          )}
                        </div>
                      ) : submission.status !== 'Pending' && (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Marks"
                            max={selectedAssignment.totalMarks}
                            className="w-24"
                            id={`marks-${submission._id}`}
                          />
                          <Input
                            placeholder="Remarks (optional)"
                            className="flex-1"
                            id={`remarks-${submission._id}`}
                          />
                          <Button
                            onClick={() => {
                              const marks = document.getElementById(`marks-${submission._id}`).value;
                              const remarks = document.getElementById(`remarks-${submission._id}`).value;
                              if (marks) gradeSubmission(submission._id, parseInt(marks), remarks);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Grade
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {submissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
