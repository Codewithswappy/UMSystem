import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  GraduationCap, 
  School, 
  TrendingUp, 
  Calendar, 
  Bell, 
  ArrowUpRight,
  MoreHorizontal,
  Loader2,
  Plus,
  Megaphone,
  FileText,
  Search
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { studentAPI, facultyAPI, applicationAPI } from "../../services/api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [stats, setStats] = useState({
    students: { total: 0, active: 0 },
    faculty: { total: 0, active: 0 },
    applications: { total: 0, pending: 0, approved: 0 }
  });
  const [recentApplications, setRecentApplications] = useState([]);

  // Mock chart data for now (replace with real data if available)
  const chartData = [
    { name: 'Jan', students: 2400 },
    { name: 'Feb', students: 1398 },
    { name: 'Mar', students: 9800 },
    { name: 'Apr', students: 3908 },
    { name: 'May', students: 4800 },
    { name: 'Jun', students: 3800 },
    { name: 'Jul', students: 4300 },
  ];

  useEffect(() => {
    // Get admin name from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setAdminName(user.name);
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [studentStats, facultyStats, appStats, recentApps] = await Promise.all([
        studentAPI.getStats(),
        facultyAPI.getStats(),
        applicationAPI.getStats(),
        applicationAPI.getAll()
      ]);

      setStats({
        students: studentStats.data,
        faculty: facultyStats.data,
        applications: appStats.data
      });

      const enrolled = recentApps.data
        .filter(app => app.status === 'Approved')
        .slice(0, 3);
      setRecentApplications(enrolled);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {adminName}</h1>
          <p className="text-gray-500 mt-1">Overview of university performance and activities.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-10 bg-white border-none shadow-sm rounded-xl" />
          </div>
          <Button size="icon" variant="ghost" className="rounded-full bg-white shadow-sm relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full relative">
            <div className="absolute top-6 right-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.applications.total}</h3>
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-bold text-orange-500">{stats.applications.pending}</span> pending review
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(stats.applications.approved / stats.applications.total) * 100}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full relative">
            <div className="absolute top-6 right-6">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.students.total}</h3>
              </div>
              <div className="mt-6">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                  {stats.students.active} Active
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full relative">
            <div className="absolute top-6 right-6">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <School className="w-5 h-5" />
              </div>
            </div>
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Faculty</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.faculty.total}</h3>
              </div>
              <div className="mt-6">
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full inline-block">
                  {stats.faculty.active} Active
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Enrollment Trend Chart */}
          <section>
            <h2 className="text-xl font-bold mb-4">Enrollment Trends</h2>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white p-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="students" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorStudents)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          {/* Recent Enrollments */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Enrollments</h2>
              <Button variant="ghost" className="text-sm text-gray-400 hover:text-orange-500">View All</Button>
            </div>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-white rounded-[2rem]">
                  No recent enrollments
                </div>
              ) : (
                recentApplications.map((app) => (
                  <Card key={app._id} className="border-none shadow-sm bg-white rounded-[2rem] hover:shadow-md transition-all group">
                    <CardContent className="p-4 px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${app.email}`} alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{app.name}</h4>
                          <p className="text-xs text-gray-400 font-medium">{app.department} • {new Date(app.createdAt).getFullYear()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full md:w-auto gap-4">
                        <div className="font-bold text-gray-900 text-sm">ID: {app.applicationId}</div>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-600">Enrolled</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-300 hover:text-black">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white text-black">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <Plus className="mr-2 h-4 w-4 text-orange-500" /> Add New Student
                </Button>
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <Plus className="mr-2 h-4 w-4 text-orange-500" /> Add New Faculty
                </Button>
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <Megaphone className="mr-2 h-4 w-4 text-orange-500" /> Post Announcement
                </Button>
                <Button className="w-full justify-start rounded-xl h-12 bg-white/10 hover:bg-white/20 text-black border-none">
                  <Calendar className="mr-2 h-4 w-4 text-orange-500" /> Create Event
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Status or Other Info */}
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-bold">System Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Server Status</span>
                  <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Database</span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Last Backup</span>
                  <span className="text-xs font-bold text-gray-400">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
