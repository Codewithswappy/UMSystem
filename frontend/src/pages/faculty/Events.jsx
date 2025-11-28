import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2, Heart, Plus, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

export default function FacultyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "Academic"
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events', {
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Combine date and time
      const eventDate = new Date(`${newEvent.date}T${newEvent.time}`);
      
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newEvent,
          date: eventDate
        })
      });
      const data = await response.json();
      if (data.success) {
        setEvents([...events, data.data]);
        setIsCreateModalOpen(false);
        setNewEvent({ title: "", description: "", date: "", time: "", location: "", type: "Academic" });
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const [selectedEvent, setSelectedEvent] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Upcoming campus events and activities.</p>
        </div>
        <Button 
          className="rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 ? (
             <div className="col-span-full text-center py-10 text-gray-500">No events found. Create one!</div>
          ) : (
            events.map((event, index) => {
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              const day = eventDate.getDate();
              const time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={event._id || index}>
                  <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full group cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      {/* Placeholder image based on type */}
                      <img 
                        src={event.image || `https://source.unsplash.com/800x600/?${event.type.toLowerCase()},university`} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800'}} // Fallback
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-center min-w-[3.5rem]">
                        <span className="block text-xs font-bold text-gray-500 uppercase">{month}</span>
                        <span className="block text-xl font-bold text-black leading-none">{day}</span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" /> {time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" /> {event.location}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
                      <Button variant="outline" className="w-full rounded-xl border-gray-100 hover:bg-black hover:text-white group-hover:border-black transition-all">
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Create New Event</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCreateModalOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title</Label>
                    <Input 
                      id="title" 
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      required 
                      placeholder="e.g., Guest Lecture on AI"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input 
                        id="time" 
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      required 
                      placeholder="e.g., Auditorium A"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select 
                      value={newEvent.type} 
                      onValueChange={(value) => setNewEvent({...newEvent, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      required 
                      placeholder="Event details..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-black text-white hover:bg-gray-800">Create Event</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64 bg-gray-100">
                <img 
                  src={selectedEvent.image || `https://source.unsplash.com/1200x600/?${selectedEvent?.type?.toLowerCase() || 'university'},university`} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200'}}
                />
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)} className="rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md">
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5"/>
                  </Button>
                </div>
                <div className="absolute bottom-4 left-6">
                   <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase border border-white/20">
                      {selectedEvent.type}
                   </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-orange-500" /> 
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-orange-500" /> 
                        {new Date(selectedEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-orange-500" /> 
                        {selectedEvent.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">About this Event</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Button className="flex-1 h-12 rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg text-lg font-medium">
                    Register Now
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-xl border-gray-200">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
