import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2, Heart, Loader2, X } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Use the first event as featured if available, otherwise use a placeholder
  const featuredEvent = events.length > 0 ? events[0] : null;
  const upcomingEvents = events.length > 0 ? events.slice(1) : [];

  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Discover and register for upcoming campus events.</p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" onClick={fetchEvents} className="hidden md:flex rounded-xl border-gray-200">
             Refresh
          </Button>
          <Button variant="outline" className="hidden md:flex rounded-xl border-gray-200">
            <Calendar className="mr-2 h-4 w-4" /> View Calendar
          </Button>
        </div> */}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No upcoming events found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              // ... existing map logic ...
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
              const day = eventDate.getDate();
              const time = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={event._id || index}>
                  <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden bg-white h-full group cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      <img 
                        src={event.image || `https://source.unsplash.com/800x600/?${event?.type?.toLowerCase() || 'university'},university`} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800'}}
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
            })}
        </div>
      )}

      {/* Event Details Modal */}
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
