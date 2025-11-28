import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function FacultySchedule() {
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const scheduleData = {
    "Mon": [
      { time: "09:00 AM", course: "CS101", type: "Lecture", room: "Hall A", duration: 2, color: "bg-orange-100 text-orange-700 border-orange-200" },
      { time: "02:00 PM", course: "CS401", type: "Lecture", room: "Hall B", duration: 1.5, color: "bg-purple-100 text-purple-700 border-purple-200" }
    ],
    "Tue": [
      { time: "11:00 AM", course: "CS305", type: "Lab", room: "Lab 3", duration: 2, color: "bg-blue-100 text-blue-700 border-blue-200" }
    ],
    "Wed": [
      { time: "09:00 AM", course: "CS101", type: "Lecture", room: "Hall A", duration: 2, color: "bg-orange-100 text-orange-700 border-orange-200" },
      { time: "02:00 PM", course: "CS401", type: "Lecture", room: "Hall B", duration: 1.5, color: "bg-purple-100 text-purple-700 border-purple-200" }
    ],
    "Thu": [
      { time: "11:00 AM", course: "CS305", type: "Lab", room: "Lab 3", duration: 2, color: "bg-blue-100 text-blue-700 border-blue-200" },
      { time: "04:00 PM", course: "Office Hours", type: "Meeting", room: "Room 302", duration: 1, color: "bg-gray-100 text-gray-700 border-gray-200" }
    ],
    "Fri": [
      { time: "10:00 AM", course: "SE201", type: "Lecture", room: "Room 302", duration: 1, color: "bg-green-100 text-green-700 border-green-200" }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
          <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
          <p className="text-gray-500 mt-1">View and manage your weekly class timetable.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-bold px-4">Oct 21 - Oct 25, 2024</span>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-100">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 border-b border-gray-100">
              <div className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center border-r border-gray-100 bg-gray-50/50">
                Time
              </div>
              {days.map(day => (
                <div key={day} className="p-4 text-center border-r border-gray-100 last:border-none bg-gray-50/50">
                  <span className="text-sm font-bold text-gray-900">{day}</span>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-6 border-b border-gray-100 last:border-none min-h-[100px]">
                <div className="p-4 text-xs font-bold text-gray-400 text-center border-r border-gray-100 flex items-center justify-center">
                  {time}
                </div>
                {days.map(day => {
                  const classItem = scheduleData[day]?.find(c => c.time === time);
                  return (
                    <div key={`${day}-${time}`} className="p-2 border-r border-gray-100 last:border-none relative">
                      {classItem && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`absolute inset-2 rounded-xl p-3 border ${classItem.color} flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow z-10`}
                          style={{ height: `calc(${classItem.duration * 100}% + ${(classItem.duration - 1) * 1}px)` }}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="font-bold text-sm">{classItem.course}</span>
                              <span className="text-[10px] font-bold uppercase opacity-70 border border-current px-1 rounded">{classItem.type}</span>
                            </div>
                            <div className="text-xs mt-1 opacity-80 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {classItem.room}
                            </div>
                          </div>
                          <div className="text-xs opacity-70 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {classItem.duration}h
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
