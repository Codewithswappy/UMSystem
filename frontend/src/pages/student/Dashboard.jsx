import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  User,
  GraduationCap,
  TrendingUp,
  Award,
  X,
  Calendar,
  ChevronRight,
  Megaphone,
  Bell,
  Calendar as CalendarIcon,
  MapPin,
  Plus,
  FileText,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { API_BASE_URL } from '../../services/api';

export default function StudentDashboard() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.student) {
          console.error("No student ID found");
          return;
        }

        const profileResponse = await fetch(`${API_BASE_URL}/students/${user.student}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileResponse.json();
        
        if (profileData.success) {
          setStudentProfile(profileData.data);
        }

        // Fetch Announcements
        const annResponse = await fetch(`${API_BASE_URL}/announcements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const annData = await annResponse.json();
        if (annData.success) {
          setAnnouncements(annData.data.slice(0, 3));
        }

        // Fetch Events
        const eventResponse = await fetch(`${API_BASE_URL}/events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const eventData = await eventResponse.json();
        if (eventData.success) {
          setEvents(eventData.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Mock data for charts
  const performanceData = [
    { semester: 'Sem 1', gpa: 8.2 },
    { semester: 'Sem 2', gpa: 8.5 },
    { semester: 'Sem 3', gpa: 8.3 },
    { semester: 'Sem 4', gpa: 8.8 },
    { semester: 'Sem 5', gpa: 9.0 },
    { semester: 'Current', gpa: studentProfile?.gpa || 9.2 },
  ];

  const attendanceData = [
    { subject: 'Mon', present: 85 },
    { subject: 'Tue', present: 92 },
    { subject: 'Wed', present: 78 },
    { subject: 'Thu', present: 95 },
    { subject: 'Fri', present: 88 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="text-gray-400 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, colorClass, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{value}</h3>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-gray-500 font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              {getGreeting()}, <span className="text-orange-600">{studentProfile?.name?.split(' ')[0]}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">
              {studentProfile?.status || 'Active Student'}
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={BookOpen} 
            label="Enrolled Subjects" 
            value={studentProfile?.subjects?.length || 0}
            colorClass="bg-blue-500"
            delay={0.1}
          />
          <StatCard 
            icon={GraduationCap} 
            label="Current Semester" 
            value={studentProfile?.semester || '-'}
            colorClass="bg-purple-500"
            delay={0.2}
          />
          <StatCard 
            icon={TrendingUp} 
            label="CGPA" 
            value={(studentProfile?.gpa || 9.2).toFixed(2)}
            colorClass="bg-orange-500"
            delay={0.3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GPA Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Academic Performance</h3>
                <p className="text-sm text-gray-500">GPA progression over semesters</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-none">
                +4.5% vs last sem
              </Badge>
            </div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="semester" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorGpa)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Weekly Attendance Chart */}
          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Announcements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold">Announcements</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Megaphone className="h-4 w-4 text-gray-400" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-4 space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 group cursor-pointer border-b border-gray-100 pb-3 last:border-none">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <Bell className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.content}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No new announcements.</p>
                  )}
                  <Button variant="outline" className="w-full mt-2 rounded-xl border-gray-100 hover:bg-gray-50 hover:text-orange-500">
                    View All
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold">Upcoming Events</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-4 space-y-4">
                  {events.length > 0 ? (
                    events.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className="flex flex-col items-center min-w-[3rem] bg-orange-50 rounded-xl p-2">
                          <span className="text-xs font-bold text-orange-500">{new Date(item.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-bold text-gray-900">{new Date(item.date).getDate()}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">{item.title}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No upcoming events.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Subjects Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Courses</h2>
            <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              View Schedule <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentProfile?.subjects?.map((subject, index) => (
              <motion.div
                key={subject._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedSubject(subject)}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold tracking-wider text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md uppercase">
                    {subject.code}
                  </span>
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-none font-normal">
                    {subject.type || 'Core'}
                  </Badge>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {subject.name}
                </h3>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                      {subject.faculty?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Faculty</span>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
                        {subject.faculty?.name?.split(' ')[0] || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">Credits</span>
                    <span className="text-sm font-medium text-gray-900">{subject.credits || 3}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!studentProfile?.subjects || studentProfile.subjects.length === 0) && (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No subjects assigned yet</p>
                <p className="text-gray-400 text-sm mt-1">Contact your administrator for enrollment</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modern Detail Modal */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 pb-0">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none mb-3">
                      {selectedSubject.code}
                    </Badge>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      {selectedSubject.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedSubject(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Credits</p>
                    <p className="text-xl font-bold text-gray-900">{selectedSubject.credits || 3}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Type</p>
                    <p className="text-xl font-bold text-gray-900">{selectedSubject.type || 'Core'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Schedule</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{selectedSubject.schedule || 'TBA'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Room</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{selectedSubject.room || 'TBA'}</p>
                  </div>
                   <div className="col-span-2 bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Next Topic</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{selectedSubject.nextTopic || 'Not set'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedSubject.description || "No description available for this course."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Instructor</h3>
                    {selectedSubject.faculty ? (
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                          {selectedSubject.faculty.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{selectedSubject.faculty.name}</p>
                          <p className="text-xs text-gray-500">{selectedSubject.faculty.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No faculty assigned</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-8 mt-4 bg-gray-50 border-t border-gray-100">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-6 shadow-lg shadow-gray-200">
                  View Course Materials
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
