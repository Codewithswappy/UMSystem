import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  GraduationCap, 
  FileText, 
  Megaphone, 
  Calendar,
  CalendarRange, 
  Settings, 
  PanelLeftClose, 
  PanelLeft,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/faculty" },
  { icon: Users, label: "My Classes", path: "/faculty/classes" },
  { icon: ClipboardCheck, label: "Attendance", path: "/faculty/attendance" },
  { icon: FileText, label: "Assignments", path: "/faculty/assignments" },
  { icon: GraduationCap, label: "Grading", path: "/faculty/grading" },
  { icon: Megaphone, label: "Announcements", path: "/faculty/announcements" },
  { icon: Calendar, label: "Events", path: "/faculty/events" },
  { icon: CalendarRange, label: "Schedule", path: "/faculty/schedule" },
];

const bottomItems = [{ icon: Settings, label: "Settings", path: "/faculty/settings" }];

export default function FacultySidebar({ isOpen, setIsOpen, isMobile }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle button – always on the right */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden text-gray-600 hover:bg-orange-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar container */}
      <motion.div
        className={cn(
          isMobile
            ? "fixed top-0 right-0 z-40 h-screen bg-white border-l border-neutral-200 flex flex-col shadow-sm rounded-tl-2xl"
            : "fixed top-0 left-0 z-40 h-screen bg-white border-r border-neutral-200 flex flex-col shadow-sm rounded-tr-2xl"
        )}
        initial={false}
        animate={{
          width: isOpen ? "18rem" : isMobile ? "18rem" : "5rem",
          x: isOpen ? "0%" : isMobile ? "100%" : "0%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Logo area */}
        <div className="h-25 w-full flex items-center justify-between p-4">
          <div className="flex items-center justify-center flex-1">
            {isOpen ? (
              <div className="font-bold text-2xl text-black flex items-center gap-3">
                <img src="/Logo2.png" alt="UMS Logo" className="h-12 w-auto object-contain" />
                <span className="font-extrabold tracking-tight">Faculty</span>
              </div>
            ) : (
              <img src="/Logo2.png" alt="UMS Logo" className="h-8 w-auto object-contain mx-auto" />
            )}
          </div>
          
          {/* Desktop toggle button */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-6 flex flex-col gap-3 px-3 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-none">
          <TooltipProvider delayDuration={0}>
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center rounded-2xl transition-all duration-200 group relative",
                          isOpen ? "gap-4 px-4 py-4" : "px-0 py-4 justify-center",
                          isActive ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                        )}
                      >
                        <Icon 
                          className={cn(
                            "w-5 h-5 flex-shrink-0", 
                            isActive ? "text-white" : "text-gray-400 group-hover:text-orange-600"
                          )} 
                        />
                        {isOpen && (
                          <span className="font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  {!isOpen && !isMobile && (
                    <TooltipContent side="right" className="bg-black text-white border-none z-50">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Bottom items */}
        <div className={cn("border-t border-gray-100", isOpen ? "p-6" : "p-3")}>
          <TooltipProvider delayDuration={0}>
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link to={item.path} onClick={() => isMobile && setIsOpen(false)}>
                      <div className={cn(
                        "flex items-center rounded-xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group relative",
                        isOpen ? "gap-4 px-4 py-3" : "px-0 py-3 justify-center"
                      )}>
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-orange-600 flex-shrink-0" />
                        {isOpen && (
                          <span className="font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  {!isOpen && !isMobile && (
                    <TooltipContent side="right" className="bg-black text-white border-none z-50">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
            
            {/* Logout button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  className={cn(
                    "w-full flex items-center rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 mt-2 group relative",
                    isOpen ? "gap-4 px-4 py-3" : "px-0 py-3 justify-center"
                  )}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="font-medium whitespace-nowrap">
                      Logout
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              {!isOpen && !isMobile && (
                <TooltipContent side="right" className="bg-red-500 text-white border-none z-50">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Overlay for mobile when open */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
