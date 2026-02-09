import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, MapPin, Clock, Trash2, Edit2, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { API_BASE_URL } from '../../services/api';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    category: "Academic",
    description: "",
    image: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Combine date and time for the backend 'date' field
      // Assuming backend expects a full ISO date string or similar
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        date: dateTime.toISOString(),
        location: formData.location,
        type: formData.category,
        image: formData.image
      };

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert("Event created successfully!");
        setFormData({
          title: "",
          date: "",
          time: "",
          location: "",
          category: "Academic",
          description: ""
        });
        fetchEvents();
      } else {
        alert("Failed to create event: " + data.message);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEvents(prev => prev.filter(e => e._id !== id));
      } else {
        alert("Failed to delete event: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
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

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-500 mt-1">Create and manage university-wide events.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search events..." className="pl-9 bg-white border-none shadow-sm rounded-xl" />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div key={event._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full group relative">
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                     <img 
                        src={event.image || `https://source.unsplash.com/800x600/?${event.type.toLowerCase()},university`} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800'}}
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 backdrop-blur-sm text-black hover:bg-white">
                          {event.type}
                        </Badge>
                      </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-orange-50 rounded-2xl p-3 text-center min-w-[4rem]">
                        <span className="block text-xs font-bold text-orange-600 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="block text-2xl font-bold text-gray-900 leading-none">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-black rounded-full">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleDelete(event._id)} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={event.title}>{event.title}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" /> 
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" /> 
                        {event.location}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">No events found. Create one to get started.</div>
          )}
        </div>
      )}

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Event">
        <form onSubmit={(e) => { handleSubmit(e); setIsCreateModalOpen(false); }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Event Title</label>
            <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Annual Convocation" className="bg-gray-50 border-none rounded-xl" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Date</label>
              <Input type="date" name="date" value={formData.date} onChange={handleInputChange} className="bg-gray-50 border-none rounded-xl" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Time</label>
              <Input type="time" name="time" value={formData.time} onChange={handleInputChange} className="bg-gray-50 border-none rounded-xl" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Location</label>
            <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Main Auditorium" className="bg-gray-50 border-none rounded-xl" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-50 border-none text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3">
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Image URL (Optional)</label>
            <Input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="bg-gray-50 border-none rounded-xl" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-50 border-none text-gray-900 text-sm rounded-xl focus:ring-orange-500 focus:border-orange-500 block p-3 resize-none"
              placeholder="Event details..."
              required
            />
          </div>

          <Button type="submit" className="w-full rounded-xl bg-black text-white hover:bg-gray-800 h-12 shadow-lg">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </form>
      </Modal>
    </motion.div>
  );
}

const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <Loader2 className="h-5 w-5 hidden" /> {/* Dummy to keep import valid if needed, or just use X */}
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
