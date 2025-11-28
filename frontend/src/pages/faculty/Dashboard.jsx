import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Clock, 
  FileText, 
  CheckCircle2, 
  MoreHorizontal, 
  ArrowRight,
  Plus,
  Search,
  Bell,
  Calendar as CalendarIcon,
  Megaphone,
  Loader2,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function FacultyDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch Dashboard Data
        const dashResponse = await fetch('http://localhost:5000/api/faculty/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dashData = await dashResponse.json();
        if (dashData.success) {
          setDashboardData(dashData.data);
        }

        // Fetch Announcements
        const annResponse = await fetch('http://localhost:5000/api/announcements', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const annData = await annResponse.json();
        if (annData.success) {
          setAnnouncements(annData.data.slice(0, 3));
        }

        // Fetch Events
        const eventResponse = await fetch('http://localhost:5000/api/events', {
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

  if (loading) {
      return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8" /></div>;
  }

  const faculty = dashboardData?.profile || {
    name: "Faculty Member",
    department: "Department",
    role: "Professor"
  };

  const stats = [
    { label: "Total Students", value: dashboardData?.stats?.totalStudents || "0", icon: Users, color: "bg-blue-500", trend: "In Dept" },
    { label: "Classes Today", value: "0", icon: Clock, color: "bg-orange-500", trend: "On Track" },
    { label: "Pending Grading", value: "0", icon: FileText, color: "bg-purple-500", trend: "Due Soon" },
    { label: "Avg Attendance", value: "0%", icon: CheckCircle2, color: "bg-green-500", trend: "Stable" },
  ];

  // Use recent students from backend if available, else empty
  const recentStudentsList = dashboardData?.recentStudents || [];

  // Use real subjects from backend
  const subjects = dashboardData?.profile?.subjects || [];
  
  // Schedule removed


  const attendanceData = [
    { day: 'Mon', present: 95 },
    { day: 'Tue', present: 88 },
    { day: 'Wed', present: 92 },
    { day: 'Thu', present: 85 },
    { day: 'Fri', present: 90 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-8 font-sans text-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {faculty.name}!</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your classes today.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search students, classes..." className="pl-10 bg-white border-none shadow-sm rounded-xl" />
          </div>
          <Button size="icon" variant="ghost" className="rounded-full bg-white shadow-sm relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="xl:col-span-2 space-y-8">

          {/* Attendance Trend Chart */}
          <section>
            <h2 className="text-xl font-bold mb-4">Weekly Attendance Overview</h2>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="present" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAttendance)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden  text-black">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <Plus className="mr-2 h-4 w-4 text-orange-500" /> Create Assignment
                </Button>
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <Megaphone className="mr-2 h-4 w-4 text-orange-500" /> Post Announcement
                </Button>
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <FileText className="mr-2 h-4 w-4 text-orange-500" /> Upload Materials
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
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
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
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
    </motion.div>
  );
}
