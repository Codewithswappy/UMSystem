import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MoreHorizontal, Filter, Megaphone, Calendar, Loader2, X, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { announcementAPI } from "../../services/api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "General",
    audience: "All"
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await announcementAPI.create(formData);
      fetchAnnouncements();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert(error.message || "Failed to create announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await announcementAPI.delete(id);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "General",
      audience: "All"
    });
  };

  const filteredAnnouncements = announcements.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Announcements</h1>
          <div className="flex gap-2 mt-4">
            <span className="px-4 py-1.5 bg-white rounded-full text-sm font-semibold shadow-sm text-gray-900 border border-gray-100">All Posts</span>
          </div>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="rounded-full bg-black text-white hover:bg-gray-900 h-12 px-6 font-bold w-full md:w-auto"
        >
          <Plus className="mr-2 h-5 w-5" /> New Post
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold w-full md:w-auto">Recent Updates</CardTitle>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search posts..." 
                className="pl-10 bg-gray-50 border-none rounded-xl h-10 focus-visible:ring-1 focus-visible:ring-gray-200 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-gray-200 h-10 w-10 shrink-0">
              <Filter className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[800px] space-y-4">
                <div className="grid grid-cols-5 text-sm font-medium text-gray-400 border-b border-gray-50 pb-4 px-4">
                  <div className="col-span-2">Title</div>
                  <div className="col-span-1">Type</div>
                  <div className="col-span-1">Audience</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                
                {filteredAnnouncements.map((item, index) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-5 items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 truncate max-w-[200px]">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.type === 'Urgent' ? 'bg-red-50 text-red-600' : 
                        item.type === 'Event' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="col-span-1 text-sm font-medium text-gray-600">
                      {item.audience}
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Announcement Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New Announcement</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <Input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Content</label>
                  <textarea 
                    required
                    className="w-full mt-1 px-3 py-2 border rounded-md min-h-[100px]"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <select 
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="General">General</option>
                      <option value="Academic">Academic</option>
                      <option value="Event">Event</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Audience</label>
                    <select 
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                      value={formData.audience}
                      onChange={(e) => setFormData({...formData, audience: e.target.value})}
                    >
                      <option value="All">All</option>
                      <option value="Students">Students</option>
                      <option value="Faculty">Faculty</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-black text-white hover:bg-gray-900">
                    Post Announcement
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
