import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Megaphone, Calendar, BookOpen, Info, Bell, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { announcementAPI } from "../../services/api";

export default function FacultyAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementAPI.getAll();
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = filter === "All" 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  const categories = ["All", "General", "Academic", "Event", "Urgent"];

  const getCategoryIcon = (category) => {
    switch(category) {
      case "Academic": return <BookOpen className="h-4 w-4" />;
      case "Event": return <Calendar className="h-4 w-4" />;
      case "Urgent": return <Bell className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case "Academic": return "bg-blue-100 text-blue-700";
      case "Event": return "bg-purple-100 text-purple-700";
      case "Urgent": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
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

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 mt-1">Stay updated with university announcements.</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filter === cat 
                ? "bg-black text-white shadow-lg transform scale-105" 
                : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <Card className="border-none shadow-sm rounded-[2rem] bg-white">
            <CardContent className="p-12 text-center">
              <p className="text-gray-400">No announcements found.</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredAnnouncements.map((item) => (
              <motion.div 
                key={item._id} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] overflow-hidden bg-white group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${getCategoryColor(item.type)} bg-opacity-50`}>
                        {getCategoryIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`${getCategoryColor(item.type)} border-none`}>
                            {item.type}
                          </Badge>
                          <span className="text-xs text-gray-400">• {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                        <div className="mt-4 pt-4 border-t border-gray-50">
                          <span className="text-xs font-bold text-gray-400">Posted by {item.createdBy || 'Admin'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
