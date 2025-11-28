# University Management System (UMS)

A comprehensive, modern web-based University Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

---

## 🎯 Overview

The University Management System is a full-stack web application designed to streamline university operations. It provides separate dashboards for administrators, faculty members, and students, each with role-specific features and functionalities.

### Key Highlights

- **Modern UI/UX**: Clean, minimal design with smooth animations using Framer Motion
- **Role-Based Access Control**: Secure authentication with JWT tokens
- **Real-time Data**: Live updates for attendance, grades, and announcements
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Indian Currency Support**: Billing system with INR formatting

---

## ✨ Features

### 👨‍💼 Admin Dashboard
- **Application Management**: Review and approve/reject student applications
- **User Management**: Create and manage admin, faculty, and student accounts
- **Student Management**: View, edit, and manage student records
- **Faculty Management**: Manage faculty profiles and assignments
- **Subject Management**: Create and assign subjects to courses
- **Fee Management**: Set and track student fees in INR
- **Announcements**: Broadcast important updates to all users
- **Events**: Create and manage university events
- **Analytics**: Dashboard with key metrics and statistics

### 👨‍🏫 Faculty Dashboard
- **Class Management**: View assigned classes and subjects
- **Attendance Tracking**: Mark and manage student attendance
- **Assignment Management**: Create, distribute, and grade assignments
- **Grading System**: Input and manage student grades
- **Schedule**: View teaching schedule and timetable
- **Announcements**: View and create announcements
- **Profile Settings**: Manage personal information

### 👨‍🎓 Student Dashboard
- **Academic Overview**: View GPA, attendance, and performance metrics
- **Attendance**: Track attendance across all subjects
- **Assignments**: View, download, and submit assignments
- **Results**: Check grades and academic performance
- **Billing**: View and pay fees in Indian Rupees (INR)
- **Events**: Browse upcoming university events
- **Announcements**: Stay updated with latest news
- **Profile**: Manage personal information

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Reusable component library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File upload handling
- **Cors** - Cross-origin resource sharing

---

## 📁 Project Structure

```
umsystem/
├── backend/                 # Backend API server
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── uploads/           # File uploads storage
│   ├── .env               # Environment variables
│   ├── .env.example       # Environment template
│   ├── server.js          # Entry point
│   └── package.json       # Dependencies
│
└── frontend/              # React frontend
    ├── public/            # Static assets
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── pages/         # Page components
    │   │   ├── admin/     # Admin pages
    │   │   ├── faculty/   # Faculty pages
    │   │   └── student/   # Student pages
    │   ├── services/      # API services
    │   ├── lib/           # Utilities
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── package.json       # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd umsystem
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGODB_URI
# - JWT_SECRET
# - EMAIL_USER
# - EMAIL_PASS
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Create Admin Account**
```bash
cd ../backend
node seed.js
```
This creates an admin account:
- Email: `admin@university.edu`
- Password: `admin123`

5. **Start the Application**

**Backend** (Terminal 1):
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

6. **Access the Application**
- Landing Page: `http://localhost:5173`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`

---

## 👥 User Roles

### 1. Admin
**Access Level**: Full system control

**Default Credentials**:
- Email: `admin@university.edu`
- Password: `admin123`

**Capabilities**:
- Approve/reject student applications
- Create and manage all user accounts
- Manage subjects, courses, and departments
- Set and track student fees
- View system-wide analytics
- Broadcast announcements

### 2. Faculty
**Access Level**: Teaching and grading functions

**Login**: Use credentials provided by admin

**Capabilities**:
- Mark student attendance
- Create and grade assignments
- Input student grades
- View assigned classes
- Manage teaching schedule
- Post announcements

### 3. Student
**Access Level**: View academic information

**Login**: Register via application form, wait for admin approval

**Capabilities**:
- View attendance and grades
- Submit assignments
- Pay fees online
- Check academic performance
- View announcements and events
- Update profile information

---

## 📚 Documentation

For detailed documentation, please refer to:

- [Backend Documentation](./BACKEND.md) - API endpoints, models, and backend architecture
- [Frontend Documentation](./FRONTEND.md) - Components, pages, and frontend structure
- [Workflow Guide](./WORKFLOW.md) - Step-by-step user workflows and use cases

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password

### Admin
- `GET /api/applications` - Get all applications
- `PUT /api/applications/:id/approve` - Approve application
- `PUT /api/applications/:id/reject` - Reject application
- `GET /api/students` - Get all students
- `GET /api/faculty` - Get all faculty
- `POST /api/fees` - Create fee

### Faculty
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment
- `POST /api/results` - Submit grades

### Student
- `GET /api/fees/myfees` - Get student fees
- `PUT /api/fees/:id/pay` - Pay fee
- `GET /api/assignments/student` - Get student assignments
- `POST /api/assignments/:id/submit` - Submit assignment
- `GET /api/results/student` - Get student results

For complete API documentation, see [BACKEND.md](./BACKEND.md)

---

## 🎨 Screenshots

### Landing Page
Modern, clean landing page with hero section, features, and FAQ.

### Admin Dashboard
Comprehensive dashboard with application management, user statistics, and quick actions.

### Faculty Dashboard
Teaching-focused interface with attendance tracking, assignment management, and grading tools.

### Student Dashboard
Student-centric view with academic performance, attendance, and billing information.

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for passwords
- **Role-Based Access Control**: Middleware-protected routes
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured cross-origin policies
- **Environment Variables**: Sensitive data stored securely

---

## 🌟 Key Features Explained

### Billing System (INR)
- Students can view all fees (tuition, exam, library, etc.)
- Pay fees online with status tracking
- Admin can create and manage fees
- Currency formatted in Indian Rupees (₹)

### Attendance System
- Faculty marks attendance by subject
- Real-time attendance percentage calculation
- Student can view attendance across all subjects
- Admin can view overall attendance statistics

### Assignment System
- Faculty creates assignments with deadlines
- Students submit assignments (file upload)
- Faculty grades submissions
- Automatic status tracking (Pending/Submitted/Graded)

### Grading System
- Faculty inputs grades for each subject
- Automatic GPA calculation
- Students view results by semester
- Admin can view overall performance metrics

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer Notes

### Environment Variables Required

```env
# Database
MONGODB_URI=mongodb://localhost:27017/umsystem

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
```

### Running in Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Serve the built files from your backend or use a static hosting service.

3. Update environment variables for production.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for modern education management**
