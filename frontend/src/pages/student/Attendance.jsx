import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function StudentAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [stats, setStats] = useState({
    overall: 0,
    present: 0,
    absent: 0,
    late: 0,
    total: 0
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/attendance/my-attendance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setAttendanceData(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const present = data.filter(r => r.status === 'Present').length;
    const absent = data.filter(r => r.status === 'Absent').length;
    const late = data.filter(r => r.status === 'Late').length;
    const overall = total === 0 ? 0 : Math.round(((present + late) / total) * 100);

    setStats({ overall, present, absent, late, total });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(selectedMonth);
  const monthName = selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const getDayStatus = (day) => {
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toDateString();
    const records = attendanceData.filter(r => new Date(r.date).toDateString() === dateStr);
    
    if (records.length === 0) return null;
    
    // If multiple records for a day, prioritize Absent > Late > Present for the dot color
    if (records.some(r => r.status === 'Absent')) return 'Absent';
    if (records.some(r => r.status === 'Late')) return 'Late';
    return 'Present';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300 mb-4" />
        <p className="text-gray-400 font-medium">Loading attendance...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance</h1>
          <p className="text-gray-500 mt-2 font-medium">Track your academic presence</p>
        </div>
        
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall</span>
            <span className={cn(
              "text-2xl font-bold",
              stats.overall >= 75 ? "text-green-500" : "text-orange-500"
            )}>{stats.overall}%</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Present</span>
            <span className="text-2xl font-bold text-gray-900">{stats.present}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Absent</span>
            <span className="text-2xl font-bold text-gray-900">{stats.absent}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar View */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white h-full">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">Calendar View</CardTitle>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-bold w-32 text-center">{monthName}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
                  onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-7 gap-4 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const isToday = new Date().toDateString() === new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day).toDateString();
                  
                  return (
                    <div key={day} className="aspect-square flex flex-col items-center justify-center relative group cursor-pointer">
                      <div className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300",
                        isToday ? "bg-black text-white shadow-lg scale-110" : "text-gray-700 hover:bg-gray-50",
                        status === 'Absent' && !isToday && "bg-red-50 text-red-600",
                        status === 'Present' && !isToday && "bg-green-50 text-green-600",
                        status === 'Late' && !isToday && "bg-yellow-50 text-yellow-600"
                      )}>
                        {day}
                      </div>
                      {status && (
                        <div className={cn(
                          "absolute -bottom-1 w-1.5 h-1.5 rounded-full",
                          status === 'Present' ? "bg-green-500" :
                          status === 'Absent' ? "bg-red-500" : "bg-yellow-500"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-8 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> Present
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Absent
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" /> Late
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white h-full flex flex-col">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
              <div className="divide-y divide-gray-50">
                {attendanceData.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No records found</div>
                ) : (
                  attendanceData.slice(0, 10).map((record, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                        record.status === 'Present' ? "bg-green-100 text-green-600" :
                        record.status === 'Absent' ? "bg-red-100 text-red-600" :
                        "bg-yellow-100 text-yellow-600"
                      )}>
                        {record.status === 'Present' ? <CheckCircle2 className="w-6 h-6" /> :
                         record.status === 'Absent' ? <XCircle className="w-6 h-6" /> :
                         <Clock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{record.subject?.name || 'Unknown Subject'}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className={cn(
                        "text-xs font-bold px-2.5 py-1 rounded-full",
                        record.status === 'Present' ? "bg-green-50 text-green-600" :
                        record.status === 'Absent' ? "bg-red-50 text-red-600" :
                        "bg-yellow-50 text-yellow-600"
                      )}>
                        {record.status}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
