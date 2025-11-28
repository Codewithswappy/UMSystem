import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  TrendingUp, 
  Download, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [semesterResults, setSemesterResults] = useState([]);
  const [cgpa, setCgpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchStudentProfile();
  }, [selectedSemester]);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`http://localhost:5000/api/students/${user.student}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setStudentProfile(data.data);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = selectedSemester === 'all' 
        ? 'http://localhost:5000/api/results/student/my-results'
        : `http://localhost:5000/api/results/student/my-results?semester=${selectedSemester}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data.results);
        setSemesterResults(data.data.semesterResults);
        setCgpa(data.data.cgpa);
        setTotalCredits(data.data.totalCredits);
        setEarnedCredits(data.data.earnedCredits);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'bg-green-50 text-green-700 border-green-200',
      'A': 'bg-green-50 text-green-600 border-green-200',
      'B+': 'bg-blue-50 text-blue-700 border-blue-200',
      'B': 'bg-blue-50 text-blue-600 border-blue-200',
      'C': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'D': 'bg-orange-50 text-orange-700 border-orange-200',
      'F': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[grade] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const downloadResultCard = () => {
    try {
      if (!results || results.length === 0) {
        alert('No results available to download.');
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(249, 115, 22); // Orange-500
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('UNIVERSITY MANAGEMENT SYSTEM', pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Academic Transcript', pageWidth / 2, 28, { align: 'center' });
      
      // Student Info
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(10);
      
      let yPos = 55;
      
      const leftX = 20;
      const rightX = pageWidth / 2 + 10;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Student Information', leftX, yPos);
      yPos += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${studentProfile?.name || 'N/A'}`, leftX, yPos);
      doc.text(`ID: ${studentProfile?.studentId || 'N/A'}`, rightX, yPos);
      yPos += 6;
      
      doc.text(`Department: ${studentProfile?.department || 'N/A'}`, leftX, yPos);
      
      // Handle long course name
      const courseLabel = "Course: ";
      const courseValue = studentProfile?.course || 'N/A';
      const maxWidth = 80;
      
      doc.text(courseLabel, rightX, yPos);
      const splitCourse = doc.splitTextToSize(courseValue, maxWidth);
      doc.text(splitCourse, rightX + doc.getTextWidth(courseLabel), yPos);
      
      yPos += (splitCourse.length * 6);
      doc.text(`Email: ${studentProfile?.email || 'N/A'}`, leftX, yPos);
      
      // Summary
      yPos += 15;
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPos - 5, pageWidth - 30, 20, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.text('Academic Summary', 20, yPos + 5);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`CGPA: ${cgpa}`, 20, yPos + 12);
      doc.text(`Credits Earned: ${earnedCredits}/${totalCredits}`, 80, yPos + 12);
      doc.text(`Overall Status: ${results.filter(r => r.status === 'Fail').length === 0 ? 'PASS' : 'BACKLOG'}`, 150, yPos + 12);
      
      yPos += 25;
      
      // Results
      semesterResults.forEach((semData) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(249, 115, 22);
        doc.text(`Semester ${semData.semester}`, 20, yPos);
        
        doc.setTextColor(33, 33, 33);
        doc.setFontSize(10);
        doc.text(`SGPA: ${semData.sgpa}`, pageWidth - 30, yPos, { align: 'right' });
        
        yPos += 5;
        
        const tableData = semData.results.map(result => [
          result.subject?.code || '-',
          result.subject?.name || '-',
          result.internalMarks,
          result.externalMarks,
          result.totalMarks,
          result.grade,
          result.gradePoint,
          result.status
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Code', 'Subject', 'Int', 'Ext', 'Total', 'Grade', 'GP', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: 'bold', fontSize: 9 },
          styles: { fontSize: 8, cellPadding: 3, textColor: 50 },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 12, halign: 'center' },
            3: { cellWidth: 12, halign: 'center' },
            4: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
            5: { cellWidth: 15, halign: 'center' },
            6: { cellWidth: 10, halign: 'center' },
            7: { cellWidth: 20, halign: 'center' }
          },
          didDrawPage: (data) => {
            yPos = data.cursor.y + 10;
          }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
      });
      
      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`Transcript_${studentProfile?.studentId || 'Student'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 animate-pulse">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Academic Results</h1>
            <p className="text-gray-500 mt-1">Track your performance and grades</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none cursor-pointer hover:border-orange-200 transition-colors"
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={downloadResultCard}
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-6 shadow-lg shadow-gray-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Pdf
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-none">
                Excellent
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cumulative GPA</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{cgpa}</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-400">Total Credits</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Credits Earned</p>
              <div className="flex items-baseline gap-1 mt-1">
                <h3 className="text-3xl font-bold text-gray-900">{earnedCredits}</h3>
                <span className="text-gray-400 font-medium">/ {totalCredits}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${results.some(r => r.status === 'Fail') ? 'bg-red-50' : 'bg-green-50'}`}>
                {results.some(r => r.status === 'Fail') ? (
                  <XCircle className="h-6 w-6 text-red-600" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-400">Academic Standing</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Status</p>
              <h3 className={`text-3xl font-bold mt-1 ${results.some(r => r.status === 'Fail') ? 'text-red-600' : 'text-green-600'}`}>
                {results.some(r => r.status === 'Fail') ? 'Backlog' : 'Good Standing'}
              </h3>
            </div>
          </motion.div>
        </div>

        {/* Semester Results */}
        <div className="space-y-8">
          {semesterResults.map((semData, index) => (
            <motion.div
              key={semData.semester}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-700 shadow-sm">
                    {semData.semester}
                  </div>
                  <h3 className="font-bold text-gray-900">Semester {semData.semester}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">SGPA</p>
                    <p className="text-lg font-bold text-gray-900">{semData.sgpa}</p>
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Credits</p>
                    <p className="text-lg font-bold text-gray-900">{semData.earnedCredits}/{semData.totalCredits}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Internal</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">External</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {semData.results.map((result) => (
                        <tr key={result._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{result.subject?.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {result.subject?.code}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {result.subject?.credits || 3} Credits
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4 text-sm text-gray-600">
                            {result.internalMarks}/30
                          </td>
                          <td className="text-center py-4 px-4 text-sm text-gray-600">
                            {result.externalMarks}/70
                          </td>
                          <td className="text-center py-4 px-4">
                            <span className="font-bold text-gray-900">{result.totalMarks}</span>
                            <span className="text-xs text-gray-400 ml-1">/100</span>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge variant="outline" className={`${getGradeColor(result.grade)} border font-medium`}>
                              {result.grade} ({result.gradePoint})
                            </Badge>
                          </td>
                          <td className="text-center py-4 px-4">
                            {result.status === 'Pass' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                Pass
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                Fail
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ))}

          {results.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No results published yet</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
