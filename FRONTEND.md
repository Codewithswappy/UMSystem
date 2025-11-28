# Frontend Documentation - University Management System

Complete guide to the frontend architecture, components, pages, and user workflows.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Components](#components)
- [Pages](#pages)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [User Workflows](#user-workflows)

---

## 🏗️ Architecture Overview

The frontend is built with **React 19** using a component-based architecture with the following structure:

```
User Interface
     ↓
  Pages (Routes)
     ↓
  Components
     ↓
  API Services
     ↓
  Backend API
```

### Key Principles

- **Component Reusability**: Shadcn UI components used throughout
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Role-Based UI**: Different dashboards for Admin, Faculty, Student
- **Modern UX**: Smooth animations with Framer Motion
- **Type Safety**: PropTypes for component validation

---

## 🛠️ Technology Stack

### Core
- **React 19.2.0** - UI library
- **React Router DOM 7.9.6** - Client-side routing
- **Vite 7.2.4** - Build tool and dev server

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Shadcn UI** - Component library
- **Framer Motion 12.23.24** - Animations
- **Lucide React 0.554.0** - Icon library

### Data & API
- **Axios 1.13.2** - HTTP client
- **Recharts 3.5.1** - Charts and graphs

### Forms & Validation
- **React Hook Form** - Form handling
- **Zod** - Schema validation

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── Logo2.png             # University logo
│   ├── featuresRight.png     # Landing page image
│   └── uniHeroSec.jpg        # Hero section image
│
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # Shadcn UI components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── select.jsx
│   │   │   ├── textarea.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── switch.jsx
│   │   │   ├── tooltip.jsx
│   │   │   └── dropdown-menu.jsx
│   │   │
│   │   ├── AdminLayout.jsx   # Admin dashboard layout
│   │   ├── FacultyLayout.jsx # Faculty dashboard layout
│   │   ├── StudentLayout.jsx # Student dashboard layout
│   │   ├── Sidebar.jsx       # Admin sidebar
│   │   ├── FacultySidebar.jsx
│   │   └── StudentSidebar.jsx
│   │
│   ├── pages/               # Page components
│   │   ├── LandingPage.jsx  # Public landing page
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── ChangePassword.jsx
│   │   │
│   │   ├── admin/           # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   ├── FacultyManagement.jsx
│   │   │   ├── SubjectManagement.jsx
│   │   │   ├── Fees.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── Events.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── faculty/         # Faculty pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Classes.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── Grading.jsx
│   │   │   ├── Schedule.jsx
│   │   │   ├── Announcements.jsx
│   │   │   ├── Events.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   └── student/         # Student pages
│   │       ├── Dashboard.jsx
│   │       ├── Attendance.jsx
│   │       ├── Assignments.jsx
│   │       ├── Results.jsx
│   │       ├── Billing.jsx
│   │       ├── Events.jsx
│   │       ├── Announcements.jsx
│   │       ├── Profile.jsx
│   │       └── Settings.jsx
│   │
│   ├── services/            # API services
│   │   └── api.js          # API configuration
│   │
│   ├── lib/                # Utilities
│   │   └── utils.js        # Helper functions
│   │
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
│
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── postcss.config.js       # PostCSS configuration
```

---

## 🧩 Components

### Layout Components

#### 1. AdminLayout (`components/AdminLayout.jsx`)

**Purpose**: Wrapper for all admin pages

**Features**:
- Responsive sidebar
- Mobile menu toggle
- Automatic sidebar collapse on mobile
- Content area with proper spacing

**Usage**:
```jsx
<AdminLayout>
  <Outlet /> {/* Child routes render here */}
</AdminLayout>
```

**State**:
- `isSidebarOpen`: Controls sidebar visibility
- `isMobile`: Detects mobile viewport

---

#### 2. Sidebar (`components/Sidebar.jsx`)

**Purpose**: Admin navigation sidebar

**Features**:
- Collapsible design
- Active route highlighting
- Tooltips for collapsed state
- Smooth animations
- Logout functionality

**Navigation Items**:
```javascript
[
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FileText, label: "Applications", path: "/admin/applications" },
  { icon: Users, label: "User Management", path: "/admin/users" },
  { icon: GraduationCap, label: "Students", path: "/admin/students" },
  { icon: School, label: "Faculty", path: "/admin/faculty" },
  { icon: BookOpen, label: "Subjects", path: "/admin/subjects" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: CreditCard, label: "Fees", path: "/admin/fees" },
  { icon: Settings, label: "Settings", path: "/admin/settings" }
]
```

---

#### 3. FacultySidebar (`components/FacultySidebar.jsx`)

**Navigation Items**:
```javascript
[
  { icon: LayoutDashboard, label: "Dashboard", path: "/faculty" },
  { icon: BookOpen, label: "Classes", path: "/faculty/classes" },
  { icon: ClipboardCheck, label: "Attendance", path: "/faculty/attendance" },
  { icon: FileText, label: "Assignments", path: "/faculty/assignments" },
  { icon: Award, label: "Grading", path: "/faculty/grading" },
  { icon: Calendar, label: "Schedule", path: "/faculty/schedule" },
  { icon: Megaphone, label: "Announcements", path: "/faculty/announcements" },
  { icon: CalendarDays, label: "Events", path: "/faculty/events" },
  { icon: Settings, label: "Settings", path: "/faculty/settings" }
]
```

---

#### 4. StudentSidebar (`components/StudentSidebar.jsx`)

**Navigation Items**:
```javascript
[
  { icon: LayoutDashboard, label: "Dashboard", path: "/student" },
  { icon: ClipboardCheck, label: "Attendance", path: "/student/attendance" },
  { icon: FileText, label: "Assignments", path: "/student/assignments" },
  { icon: Award, label: "Results", path: "/student/results" },
  { icon: CreditCard, label: "Billing", path: "/student/billing" },
  { icon: CalendarDays, label: "Events", path: "/student/events" },
  { icon: Megaphone, label: "Announcements", path: "/student/announcements" },
  { icon: User, label: "Profile", path: "/student/profile" },
  { icon: Settings, label: "Settings", path: "/student/settings" }
]
```

---

### UI Components (Shadcn)

All UI components are located in `components/ui/` and follow Shadcn's design system.

#### Button (`ui/button.jsx`)

**Variants**:
- `default`: Black background
- `outline`: Border only
- `ghost`: No background
- `destructive`: Red (for delete actions)

**Sizes**:
- `sm`: Small
- `default`: Medium
- `lg`: Large
- `icon`: Square icon button

**Usage**:
```jsx
<Button variant="default" size="lg">
  Click Me
</Button>
```

---

#### Card (`ui/card.jsx`)

**Components**:
- `Card`: Container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardContent`: Main content

**Usage**:
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

---

#### Input (`ui/input.jsx`)

**Features**:
- Rounded corners
- Focus states
- Error states
- Disabled states

**Usage**:
```jsx
<Input 
  type="email" 
  placeholder="Enter email"
  className="rounded-xl"
/>
```

---

#### Select (`ui/select.jsx`)

**Components**:
- `Select`: Container
- `SelectTrigger`: Button to open dropdown
- `SelectValue`: Selected value display
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option

**Usage**:
```jsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## 📄 Pages

### Public Pages

#### 1. Landing Page (`pages/LandingPage.jsx`)

**Purpose**: Marketing page for the university system

**Sections**:
1. **Navbar**: Logo, navigation links, login/register buttons
2. **Hero**: Large heading, CTA buttons, hero image
3. **Features**: System capabilities showcase
4. **Why Choose Us**: Benefits and advantages
5. **About Us**: University information
6. **FAQ**: Frequently asked questions
7. **Footer**: Links and contact information

**Key Features**:
- Smooth scroll navigation
- Responsive design
- Framer Motion animations
- Modern glassmorphism effects

**CTA Buttons**:
- "Apply for Admission" → `/register`
- "Log in" → `/login`

---

#### 2. Login Page (`pages/Login.jsx`)

**Purpose**: User authentication

**Features**:
- Role selection (Admin/Faculty/Student)
- Email and password fields
- Password visibility toggle
- Remember me option
- Error handling
- Loading states

**Form Fields**:
```javascript
{
  email: String,
  password: String,
  role: String (enum: ['admin', 'faculty', 'student'])
}
```

**Workflow**:
1. User selects role
2. Enters credentials
3. Clicks "Sign In"
4. API validates credentials
5. On success: Redirect to role-specific dashboard
6. On error: Display error message

**Redirects**:
- Admin → `/admin`
- Faculty → `/faculty`
- Student → `/student`

---

#### 3. Register Page (`pages/Register.jsx`)

**Purpose**: Student application submission

**Features**:
- Multi-step form (2 steps)
- Progress indicator
- Form validation
- Success confirmation
- Smooth step transitions

**Step 1: Personal Information**
- Full Name
- Email Address
- Phone Number
- Date of Birth
- Gender
- Address

**Step 2: Academic Information**
- Department
- Course
- Previous Education
- Percentage/CGPA

**Workflow**:
1. Student fills Step 1
2. Validation check
3. Proceeds to Step 2
4. Fills academic details
5. Submits application
6. Receives confirmation
7. Waits for admin approval

**Success Screen**:
- Green checkmark animation
- Success message
- "Go to Login" button

---

#### 4. Change Password (`pages/ChangePassword.jsx`)

**Purpose**: First-time password change for new users

**Features**:
- Current password field
- New password field
- Confirm password field
- Password strength indicator
- Validation rules

**Workflow**:
1. User logs in with temporary password
2. Redirected to change password page
3. Enters current and new password
4. Submits form
5. Password updated
6. Redirected to dashboard

---

### Admin Pages

#### 1. Admin Dashboard (`pages/admin/Dashboard.jsx`)

**Purpose**: Overview of system metrics and quick actions

**Sections**:
1. **Stats Cards**:
   - Total Students
   - Total Faculty
   - Pending Applications
   - Total Revenue

2. **Charts**:
   - Student enrollment trends
   - Department distribution
   - Revenue over time

3. **Quick Actions**:
   - Review Applications
   - Add Student
   - Add Faculty
   - Create Announcement

4. **Recent Activity**:
   - Latest applications
   - Recent registrations
   - System updates

**API Calls**:
- `GET /api/students` - Student count
- `GET /api/faculty` - Faculty count
- `GET /api/applications` - Pending applications
- `GET /api/fees` - Revenue data

---

#### 2. Applications (`pages/admin/Applications.jsx`)

**Purpose**: Review and process student applications

**Features**:
- Application list with filters
- Search functionality
- Status badges (Pending/Approved/Rejected)
- Detailed application view
- Approve/Reject actions
- Rejection reason modal

**Table Columns**:
- Application ID
- Name
- Email
- Department
- Course
- Percentage
- Status
- Actions

**Workflow - Approve**:
1. Admin clicks "Approve"
2. Confirmation modal appears
3. Admin confirms
4. API creates Student + User accounts
5. Email sent to applicant
6. Status updated to "Approved"

**Workflow - Reject**:
1. Admin clicks "Reject"
2. Rejection reason modal appears
3. Admin enters reason
4. API updates status
5. Email sent to applicant
6. Status updated to "Rejected"

---

#### 3. Student Management (`pages/admin/StudentManagement.jsx`)

**Purpose**: Manage student records

**Features**:
- Student list with search/filter
- Add new student
- Edit student details
- View student profile
- Delete student
- Export to CSV

**Student Card**:
- Student ID
- Name
- Email
- Department
- Semester
- GPA
- Status
- Actions (Edit/Delete)

**Add Student Form**:
- Personal Information
- Academic Details
- Contact Information
- Initial Password

---

#### 4. Faculty Management (`pages/admin/FacultyManagement.jsx`)

**Purpose**: Manage faculty members

**Features**:
- Faculty list
- Add new faculty
- Edit faculty details
- Assign subjects
- View teaching load
- Salary management

**Faculty Card**:
- Faculty ID
- Name
- Department
- Designation
- Experience
- Assigned Subjects
- Status

---

#### 5. Subject Management (`pages/admin/SubjectManagement.jsx`)

**Purpose**: Manage courses and subjects

**Features**:
- Subject list by department
- Create new subject
- Edit subject details
- Assign faculty
- Set credits and semester
- View enrolled students

**Subject Form**:
- Subject Code
- Subject Name
- Department
- Course
- Semester
- Credits
- Faculty Assignment
- Description

---

#### 6. Fee Management (`pages/admin/Fees.jsx`)

**Purpose**: Manage student fees and billing

**Features**:
- Fee list with student details
- Create new fee
- Search by student/fee title
- Status tracking (Paid/Pending/Overdue)
- Payment history
- Export reports

**Create Fee Form**:
- Student Selection
- Fee Title (e.g., "Semester Tuition")
- Description
- Amount (₹)
- Due Date

**Fee Table**:
- Student Name
- Fee Details
- Amount
- Due Date
- Status
- Actions

---

#### 7. Announcements (`pages/admin/Announcements.jsx`)

**Purpose**: Broadcast announcements

**Features**:
- Create announcement
- Edit/Delete announcements
- Target audience selection
- Priority levels
- Expiry date

**Announcement Form**:
- Title
- Content
- Target Audience (All/Students/Faculty)
- Priority (Low/Medium/High)
- Expiry Date (optional)

---

#### 8. Events (`pages/admin/Events.jsx`)

**Purpose**: Manage university events

**Features**:
- Event calendar view
- Create new event
- Edit/Delete events
- Registration management
- Event categories

**Event Form**:
- Title
- Description
- Event Date
- Location
- Category
- Registration Required
- Max Participants

---

#### 9. Settings (`pages/admin/Settings.jsx`)

**Purpose**: Admin account settings

**Tabs**:
1. **Admin Info**: Profile details
2. **Change Password**: Security
3. **Logout**: Sign out
4. **Delete Account**: Account removal

---

### Faculty Pages

#### 1. Faculty Dashboard (`pages/faculty/Dashboard.jsx`)

**Purpose**: Faculty overview and quick access

**Sections**:
1. **Stats**:
   - Total Classes
   - Total Students
   - Pending Assignments
   - Attendance Rate

2. **Today's Schedule**:
   - Class timings
   - Subject names
   - Room numbers

3. **Quick Actions**:
   - Mark Attendance
   - Create Assignment
   - Grade Submissions
   - Post Announcement

4. **Recent Activity**:
   - Assignment submissions
   - Attendance records
   - Student queries

---

#### 2. Classes (`pages/faculty/Classes.jsx`)

**Purpose**: View assigned classes and subjects

**Features**:
- Class list with details
- Student roster
- Subject information
- Class schedule
- Performance overview

**Class Card**:
- Subject Name
- Subject Code
- Department
- Semester
- Total Students
- Schedule
- Actions

---

#### 3. Attendance (`pages/faculty/Attendance.jsx`)

**Purpose**: Mark and manage student attendance

**Features**:
- Subject selection
- Date picker
- Student list with checkboxes
- Bulk actions (Mark All Present/Absent)
- Attendance history
- Statistics

**Workflow**:
1. Select subject
2. Select date
3. System fetches enrolled students
4. Mark each student (Present/Absent/Late)
5. Add remarks (optional)
6. Submit attendance
7. Confirmation message

**Attendance Table**:
- Student ID
- Student Name
- Status (Present/Absent/Late)
- Remarks
- Actions

---

#### 4. Assignments (`pages/faculty/Assignments.jsx`)

**Purpose**: Create and manage assignments

**Features**:
- Assignment list
- Create new assignment
- View submissions
- Grade submissions
- Download submitted files
- Statistics

**Create Assignment**:
- Title
- Description
- Subject
- Due Date
- Total Marks
- Attachment (optional)

**Submissions View**:
- Student Name
- Submission Date
- Status (Pending/Submitted/Graded)
- Marks Obtained
- Actions (Grade/Download)

**Grading Modal**:
- Student Name
- Assignment Title
- Submitted File (download link)
- Marks Input
- Feedback Textarea
- Submit Button

---

#### 5. Grading (`pages/faculty/Grading.jsx`)

**Purpose**: Input and manage student grades

**Features**:
- Subject selection
- Semester selection
- Student list
- Grade entry form
- Bulk grade upload
- Grade statistics

**Grade Entry**:
- Student Selection
- Subject
- Semester
- Exam Type (Mid-term/Final/Quiz)
- Marks Obtained
- Total Marks
- Auto-calculated Grade
- Remarks

**Grade Table**:
- Student Name
- Subject
- Marks
- Grade
- Status
- Actions

---

#### 6. Schedule (`pages/faculty/Schedule.jsx`)

**Purpose**: View teaching schedule

**Features**:
- Weekly calendar view
- Class timings
- Room assignments
- Subject details
- Color-coded by subject

---

#### 7. Faculty Announcements (`pages/faculty/Announcements.jsx`)

**Purpose**: View and create announcements

**Features**:
- View all announcements
- Create new announcement
- Filter by priority
- Search functionality

---

#### 8. Faculty Events (`pages/faculty/Events.jsx`)

**Purpose**: View university events

**Features**:
- Event calendar
- Event details
- Registration status
- Upcoming events list

---

#### 9. Faculty Settings (`pages/faculty/Settings.jsx`)

**Purpose**: Faculty account settings

**Tabs**:
1. **Profile Settings**: Personal information
2. **Security & Privacy**: Change password

---

### Student Pages

#### 1. Student Dashboard (`pages/student/Dashboard.jsx`)

**Purpose**: Student academic overview

**Sections**:
1. **Welcome Card**: Greeting with student name

2. **Stats Cards**:
   - Current GPA
   - Attendance Percentage
   - Pending Assignments
   - Upcoming Events

3. **Charts**:
   - GPA Trend (Line chart)
   - Weekly Attendance (Bar chart)

4. **Quick Links**:
   - View Attendance
   - Submit Assignment
   - Check Results
   - Pay Fees

5. **Recent Announcements**:
   - Latest 5 announcements

**API Calls**:
- `GET /api/students/profile` - Student data
- `GET /api/results/student` - GPA data
- `GET /api/attendance/student` - Attendance data
- `GET /api/assignments/student` - Assignments
- `GET /api/announcements` - Announcements

---

#### 2. Student Attendance (`pages/student/Attendance.jsx`)

**Purpose**: View attendance records

**Features**:
- Overall attendance percentage
- Subject-wise breakdown
- Monthly calendar view
- Attendance trends
- Color-coded status

**Attendance Card**:
- Subject Name
- Total Classes
- Classes Attended
- Attendance Percentage
- Status (Good/Warning/Critical)

**Calendar View**:
- Green: Present
- Red: Absent
- Yellow: Late

---

#### 3. Student Assignments (`pages/student/Assignments.jsx`)

**Purpose**: View and submit assignments

**Features**:
- Assignment list
- Filter by subject/status
- Download assignment files
- Upload submission
- View grades and feedback
- Deadline tracking

**Assignment Card**:
- Title
- Subject
- Due Date
- Total Marks
- Status (Pending/Submitted/Graded)
- Actions (Download/Submit)

**Submission Modal**:
- Assignment Details
- File Upload
- Submission Notes
- Submit Button

**Graded View**:
- Marks Obtained
- Total Marks
- Grade
- Faculty Feedback
- Download Submission

---

#### 4. Results (`pages/student/Results.jsx`)

**Purpose**: View academic results

**Features**:
- Semester-wise results
- Subject-wise grades
- GPA calculation
- Performance trends
- Download marksheet

**Result Card (per semester)**:
- Semester Number
- Total Subjects
- GPA
- Status (Pass/Fail)
- View Details Button

**Detailed View**:
- Subject Name
- Marks Obtained
- Total Marks
- Grade
- Credits
- Remarks

**GPA Calculation**:
```
GPA = Σ(Grade Points × Credits) / Σ(Credits)
```

---

#### 5. Billing (`pages/student/Billing.jsx`)

**Purpose**: View and pay fees

**Features**:
- Total outstanding amount
- Total paid amount
- Fee schedule
- Payment history
- Pay online
- Download receipts

**Summary Cards**:
1. **Total Outstanding**: Amount due (₹)
2. **Total Paid**: Amount paid (₹)
3. **Payment Method**: Saved payment info

**Fee Schedule Table**:
- Description
- Due Date
- Amount (₹)
- Status (Pending/Paid/Overdue)
- Actions (Pay Now/Receipt)

**Payment Flow**:
1. Click "Pay Now"
2. Confirm payment
3. API processes payment
4. Status updated to "Paid"
5. Transaction ID generated
6. Receipt available for download

**Currency Format**: Indian Rupees (₹)
```javascript
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(amount)
```

---

#### 6. Student Events (`pages/student/Events.jsx`)

**Purpose**: Browse university events

**Features**:
- Event list
- Filter by category
- Event details
- Registration
- Calendar view

**Event Card**:
- Title
- Date
- Location
- Category
- Description
- Register Button

---

#### 7. Student Announcements (`pages/student/Announcements.jsx`)

**Purpose**: View announcements

**Features**:
- Announcement list
- Filter by priority
- Search functionality
- Mark as read

---

#### 8. Profile (`pages/student/Profile.jsx`)

**Purpose**: View and edit profile

**Sections**:
1. **Personal Information**:
   - Name
   - Email
   - Phone
   - Date of Birth
   - Gender
   - Address

2. **Academic Information**:
   - Student ID
   - Department
   - Course
   - Semester
   - Enrollment Date
   - Status

3. **Performance**:
   - Current GPA
   - Total Credits
   - Attendance Percentage

---

#### 9. Student Settings (`pages/student/Settings.jsx`)

**Purpose**: Account settings

**Tabs**:
1. **Profile Settings**: Edit personal info
2. **Security & Privacy**: Change password

---

## 🛣️ Routing

### Route Configuration (`App.jsx`)

```javascript
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/change-password" element={<ChangePassword />} />

  {/* Admin Routes */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="applications" element={<Applications />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="students" element={<StudentManagement />} />
    <Route path="faculty" element={<FacultyManagement />} />
    <Route path="subjects" element={<SubjectManagement />} />
    <Route path="announcements" element={<Announcements />} />
    <Route path="events" element={<AdminEvents />} />
    <Route path="fees" element={<AdminFees />} />
    <Route path="settings" element={<Settings />} />
  </Route>

  {/* Faculty Routes */}
  <Route path="/faculty" element={<FacultyLayout />}>
    <Route index element={<FacultyDashboard />} />
    <Route path="classes" element={<Classes />} />
    <Route path="attendance" element={<Attendance />} />
    <Route path="assignments" element={<Assignments />} />
    <Route path="grading" element={<Grading />} />
    <Route path="schedule" element={<Schedule />} />
    <Route path="announcements" element={<FacultyAnnouncements />} />
    <Route path="events" element={<FacultyEvents />} />
    <Route path="settings" element={<FacultySettings />} />
  </Route>

  {/* Student Routes */}
  <Route path="/student" element={<StudentLayout />}>
    <Route index element={<StudentDashboard />} />
    <Route path="attendance" element={<StudentAttendance />} />
    <Route path="assignments" element={<StudentAssignments />} />
    <Route path="results" element={<Results />} />
    <Route path="billing" element={<Billing />} />
    <Route path="events" element={<StudentEvents />} />
    <Route path="announcements" element={<StudentAnnouncements />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<StudentSettings />} />
  </Route>
</Routes>
```

---

## 🔄 State Management

### Local Storage

**Stored Data**:
```javascript
{
  token: "JWT token string",
  user: {
    id: "user_id",
    email: "user@example.com",
    role: "student",
    name: "User Name",
    studentId: "STU00001" // or facultyId/adminId
  }
}
```

**Usage**:
```javascript
// Store
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Clear (logout)
localStorage.clear();
```

---

### Component State

**useState** for local component state:
```javascript
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [error, setError] = useState('');
```

**useEffect** for side effects:
```javascript
useEffect(() => {
  fetchData();
}, []);
```

---

## 🌐 API Integration

### API Service (`services/api.js`)

**Base Configuration**:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
```

**Example API Calls**:

```javascript
// GET request
const fetchStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request
const createFee = async (feeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fees`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(feeData)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// File upload
const submitAssignment = async (assignmentId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_BASE_URL}/assignments/${assignmentId}/submit`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎨 Styling

### Tailwind CSS

**Configuration** (`tailwind.config.js`):
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        primary: '#FF5722',
        secondary: '#F3F0E6'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem'
      }
    }
  }
}
```

**Common Patterns**:

```jsx
// Card with rounded corners
<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

// Button with hover effect
<button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex center
<div className="flex items-center justify-center">
```

---

### Framer Motion

**Animations**:

```jsx
// Fade in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>

// Slide in
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
>

// Hover scale
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>

// Stagger children
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🔄 User Workflows

### Student Registration Workflow

```
1. Student visits landing page
   ↓
2. Clicks "Apply for Admission"
   ↓
3. Redirected to /register
   ↓
4. Fills Step 1: Personal Info
   ↓
5. Validation check
   ↓
6. Proceeds to Step 2: Academic Info
   ↓
7. Fills academic details
   ↓
8. Submits application
   ↓
9. Success screen shown
   ↓
10. Application status: Pending
   ↓
11. Admin reviews application
   ↓
12. Admin approves
   ↓
13. Student receives email with credentials
   ↓
14. Student logs in
   ↓
15. Redirected to change password
   ↓
16. Changes password
   ↓
17. Redirected to student dashboard
```

---

### Faculty Marks Attendance Workflow

```
1. Faculty logs in
   ↓
2. Navigates to Attendance page
   ↓
3. Selects subject from dropdown
   ↓
4. Selects date
   ↓
5. System fetches enrolled students
   ↓
6. Student list displayed
   ↓
7. Faculty marks each student
   ↓
8. Clicks "Submit Attendance"
   ↓
9. API saves attendance records
   ↓
10. Success message shown
   ↓
11. Attendance percentage updated
   ↓
12. Students can view attendance
```

---

### Student Pays Fee Workflow

```
1. Student logs in
   ↓
2. Navigates to Billing page
   ↓
3. Views fee schedule
   ↓
4. Sees pending fees
   ↓
5. Clicks "Pay Now" on a fee
   ↓
6. Confirmation modal appears
   ↓
7. Student confirms payment
   ↓
8. API processes payment
   ↓
9. Status updated to "Paid"
   ↓
10. Transaction ID generated
   ↓
11. Success message shown
   ↓
12. Receipt available for download
```

---

### Admin Approves Application Workflow

```
1. Admin logs in
   ↓
2. Navigates to Applications page
   ↓
3. Views pending applications
   ↓
4. Clicks on an application
   ↓
5. Reviews application details
   ↓
6. Clicks "Approve"
   ↓
7. Confirmation modal appears
   ↓
8. Admin confirms
   ↓
9. API creates Student record
   ↓
10. API creates User record
   ↓
11. Temporary password generated
   ↓
12. Email sent to applicant
   ↓
13. Application status updated
   ↓
14. Success message shown
   ↓
15. Applicant receives email
   ↓
16. Applicant can now login
```

---

## 🚀 Running the Frontend

### Development Mode

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

---

## 🔍 Debugging

### React DevTools

Install React DevTools browser extension for:
- Component tree inspection
- Props and state viewing
- Performance profiling

### Console Logging

```javascript
console.log('Data:', data);
console.error('Error:', error);
console.table(arrayData);
```

### Network Tab

Monitor API calls in browser DevTools:
- Request/Response inspection
- Status codes
- Timing information

---

## 📱 Responsive Design

### Breakpoints

```javascript
// Tailwind breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

### Mobile-First Approach

```jsx
// Default: Mobile
<div className="text-sm">
  // Tablet and up
  <div className="md:text-base">
    // Desktop and up
    <div className="lg:text-lg">
```

---

## ✅ Best Practices

1. **Component Organization**: One component per file
2. **Naming Conventions**: PascalCase for components, camelCase for functions
3. **Props Validation**: Use PropTypes or TypeScript
4. **Error Handling**: Try-catch blocks for API calls
5. **Loading States**: Show spinners during data fetching
6. **Accessibility**: Use semantic HTML and ARIA labels
7. **Performance**: Lazy load routes and images
8. **Code Splitting**: Use React.lazy() for large components

---

**Frontend documentation complete. For backend details, see [BACKEND.md](./BACKEND.md)**
