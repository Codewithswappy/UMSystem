import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { StudentSidebar } from "./StudentSidebar";

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      <StudentSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} isMobile={isMobile} />
      <main 
        className={`flex-1 transition-all duration-300 ${
          isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-[18rem]' : 'ml-20')
        }`}
      >
        <div className="p-4 md:p-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
