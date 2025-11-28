import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import FacultyManagement from './pages/admin/FacultyManagement';
import Announcements from './pages/admin/Announcements';
import UserManagement from './pages/admin/UserManagement';
import Settings from './pages/admin/Settings';
import Applications from './pages/admin/Applications';
import AdminEvents from './pages/admin/Events';
import AdminFees from './pages/admin/Fees';
import SubjectManagement from './pages/admin/SubjectManagement';
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentAttendance from './pages/student/Attendance';
import StudentResults from './pages/student/Results';
import StudentAnnouncements from './pages/student/Announcements';
import StudentEvents from './pages/student/Events';
import StudentAssignments from './pages/student/Assignments';
import StudentBilling from './pages/student/Billing';
import StudentSettings from './pages/student/Settings';
import FacultyLayout from './components/FacultyLayout';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyClasses from './pages/faculty/Classes';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyAssignments from './pages/faculty/Assignments';
import FacultyGrading from './pages/faculty/Grading';
import FacultyAnnouncements from './pages/faculty/Announcements';
import FacultySchedule from './pages/faculty/Schedule';
import FacultySettings from './pages/faculty/Settings';
import FacultyEvents from './pages/faculty/Events';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="faculty" element={<FacultyManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="events" element={<StudentEvents />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="billing" element={<StudentBilling />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={<FacultyLayout />}>
          <Route index element={<FacultyDashboard />} />
          <Route path="classes" element={<FacultyClasses />} />
          <Route path="attendance" element={<FacultyAttendance />} />
          <Route path="assignments" element={<FacultyAssignments />} />
          <Route path="grading" element={<FacultyGrading />} />
          <Route path="announcements" element={<FacultyAnnouncements />} />
          <Route path="events" element={<FacultyEvents />} />
          <Route path="schedule" element={<FacultySchedule />} />
          <Route path="settings" element={<FacultySettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
