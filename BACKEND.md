# Backend Documentation - University Management System

Complete guide to the backend architecture, API endpoints, database models, and workflows.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Controllers](#controllers)
- [Middleware](#middleware)
- [Authentication Flow](#authentication-flow)
- [File Structure](#file-structure)
- [Environment Setup](#environment-setup)

---

## 🏗️ Architecture Overview

The backend follows a **MVC (Model-View-Controller)** pattern with the following layers:

```
Request → Routes → Middleware → Controllers → Models → Database
                      ↓
                  Response
```

### Technology Stack
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt.js
- **File Upload**: Multer
- **Email**: Nodemailer

---

## 🗄️ Database Models

### 1. User Model (`models/User.js`)

**Purpose**: Authentication and role management

**Schema**:
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'faculty', 'student']),
  isApproved: Boolean (default: false),
  mustChangePassword: Boolean (default: false),
  adminId: ObjectId (ref: 'Admin'),
  facultyId: ObjectId (ref: 'Faculty'),
  studentId: ObjectId (ref: 'Student'),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Login authentication
- Role-based access control
- Account approval workflow
- Password reset functionality

**Key Methods**:
- `pre('save')`: Automatically hashes password before saving
- Virtual fields for role-specific IDs

---

### 2. Admin Model (`models/Admin.js`)

**Purpose**: Store admin profile information

**Schema**:
```javascript
{
  name: String (required),
  email: String (unique, required),
  phone: String,
  role: String (e.g., 'Super Admin', 'Department Head'),
  department: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Admin profile management
- System administration
- User management oversight

---

### 3. Student Model (`models/Student.js`)

**Purpose**: Store student academic and personal information

**Schema**:
```javascript
{
  studentId: String (unique, auto-generated),
  name: String (required),
  email: String (unique, required),
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  department: String,
  course: String,
  semester: Number,
  enrollmentDate: Date,
  status: String (enum: ['Active', 'Inactive', 'Graduated']),
  gpa: Number,
  subjects: [ObjectId] (ref: 'Subject'),
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Student profile management
- Academic tracking
- Enrollment management
- Performance monitoring

**Auto-generated Fields**:
- `studentId`: Format `STU00001`, `STU00002`, etc.

---

### 4. Faculty Model (`models/Faculty.js`)

**Purpose**: Store faculty member information

**Schema**:
```javascript
{
  facultyId: String (unique, auto-generated),
  name: String (required),
  email: String (unique, required),
  phone: String,
  dateOfBirth: Date,
  gender: String,
  address: String,
  department: String,
  designation: String (e.g., 'Professor', 'Associate Professor'),
  qualification: String,
  experience: Number,
  salary: Number,
  joiningDate: Date,
  status: String (enum: ['Active', 'Inactive']),
  subjects: [String],
  assignedSubjects: [ObjectId] (ref: 'Subject'),
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Faculty profile management
- Subject assignment
- Teaching load tracking
- Payroll management

**Auto-generated Fields**:
- `facultyId`: Format `FAC00001`, `FAC00002`, etc.

---

### 5. Application Model (`models/Application.js`)

**Purpose**: Handle student admission applications

**Schema**:
```javascript
{
  applicationId: String (unique, auto-generated),
  name: String (required),
  email: String (required),
  phone: String (required),
  dateOfBirth: Date (required),
  gender: String (required),
  address: String (required),
  department: String (required),
  course: String (required),
  previousEducation: String,
  percentage: Number,
  status: String (enum: ['Pending', 'Approved', 'Rejected']),
  reviewedBy: ObjectId (ref: 'Admin'),
  reviewedDate: Date,
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Student admission process
- Application review workflow
- Approval/rejection tracking

**Workflow**:
1. Student submits application via `/register`
2. Admin reviews in Applications page
3. Admin approves → Creates Student + User accounts
4. Admin rejects → Application marked as rejected
5. Email sent to applicant with decision

---

### 6. Subject Model (`models/Subject.js`)

**Purpose**: Manage academic subjects and courses

**Schema**:
```javascript
{
  subjectCode: String (unique, required),
  subjectName: String (required),
  department: String (required),
  course: String (required),
  semester: Number (required),
  credits: Number (required),
  faculty: ObjectId (ref: 'Faculty'),
  description: String,
  syllabus: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Course catalog management
- Subject assignment to faculty
- Student enrollment in subjects
- Credit hour tracking

---

### 7. Attendance Model (`models/Attendance.js`)

**Purpose**: Track student attendance

**Schema**:
```javascript
{
  student: ObjectId (ref: 'Student', required),
  subject: ObjectId (ref: 'Subject', required),
  date: Date (required),
  status: String (enum: ['Present', 'Absent', 'Late'], required),
  markedBy: ObjectId (ref: 'Faculty'),
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Daily attendance marking
- Attendance percentage calculation
- Attendance reports
- Student performance tracking

**Workflow**:
1. Faculty opens Attendance page
2. Selects subject and date
3. Marks each student as Present/Absent/Late
4. System calculates attendance percentage
5. Students can view their attendance

---

### 8. Assignment Model (`models/Assignment.js`)

**Purpose**: Manage course assignments

**Schema**:
```javascript
{
  title: String (required),
  description: String (required),
  subject: ObjectId (ref: 'Subject', required),
  faculty: ObjectId (ref: 'Faculty', required),
  dueDate: Date (required),
  totalMarks: Number (required),
  attachments: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Assignment creation by faculty
- Assignment distribution to students
- Deadline management
- File attachment support

---

### 9. Submission Model (`models/Submission.js`)

**Purpose**: Track assignment submissions

**Schema**:
```javascript
{
  assignment: ObjectId (ref: 'Assignment', required),
  student: ObjectId (ref: 'Student', required),
  submittedFile: String,
  submittedAt: Date,
  marksObtained: Number,
  feedback: String,
  status: String (enum: ['Pending', 'Submitted', 'Graded']),
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Student assignment submission
- Faculty grading
- Feedback provision
- Submission tracking

**Workflow**:
1. Faculty creates assignment
2. Students view and download assignment
3. Students upload submission file
4. Faculty reviews and grades
5. Students view grades and feedback

---

### 10. Result Model (`models/Result.js`)

**Purpose**: Store student grades and results

**Schema**:
```javascript
{
  student: ObjectId (ref: 'Student', required),
  subject: ObjectId (ref: 'Subject', required),
  semester: Number (required),
  examType: String (enum: ['Mid-term', 'Final', 'Quiz']),
  marksObtained: Number (required),
  totalMarks: Number (required),
  grade: String,
  remarks: String,
  publishedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Grade entry by faculty
- Result publication
- GPA calculation
- Academic performance tracking

**Grade Calculation**:
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: Below 60

---

### 11. Fee Model (`models/Fee.js`)

**Purpose**: Manage student fees and payments

**Schema**:
```javascript
{
  student: ObjectId (ref: 'Student', required),
  title: String (required),
  description: String,
  amount: Number (required),
  dueDate: Date (required),
  status: String (enum: ['Pending', 'Paid', 'Overdue']),
  paymentMethod: String,
  paymentDate: Date,
  transactionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Fee creation by admin
- Payment tracking
- Billing management
- Financial reporting

**Currency**: Indian Rupees (INR)

**Workflow**:
1. Admin creates fee for student
2. Student views fees in Billing page
3. Student pays fee online
4. Status updated to 'Paid'
5. Transaction ID generated

---

### 12. Announcement Model (`models/Announcement.js`)

**Purpose**: Broadcast announcements

**Schema**:
```javascript
{
  title: String (required),
  content: String (required),
  author: ObjectId (ref: 'User', required),
  targetAudience: String (enum: ['All', 'Students', 'Faculty']),
  priority: String (enum: ['Low', 'Medium', 'High']),
  expiryDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Important notifications
- Event announcements
- Policy updates
- Emergency alerts

---

### 13. Event Model (`models/Event.js`)

**Purpose**: Manage university events

**Schema**:
```javascript
{
  title: String (required),
  description: String (required),
  eventDate: Date (required),
  location: String (required),
  organizer: ObjectId (ref: 'User'),
  category: String,
  registrationRequired: Boolean,
  maxParticipants: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Use Cases**:
- Event creation
- Event calendar
- Registration management
- Event notifications

---

## 🛣️ API Routes

### Authentication Routes (`/api/auth`)

#### 1. Register Student
```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "2002-01-15",
  "gender": "Male",
  "address": "123 Main St",
  "department": "Computer Science",
  "course": "BCA",
  "previousEducation": "High School",
  "percentage": 85.5
}
```

**Response**:
```json
{
  "success": true,
  "message": "Application submitted successfully"
}
```

**Workflow**:
1. Validates input data
2. Creates Application record with status 'Pending'
3. Sends confirmation email
4. Returns success message

---

#### 2. Login
```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "student",
      "name": "John Doe"
    }
  }
}
```

**Workflow**:
1. Validates credentials
2. Checks if account is approved
3. Generates JWT token
4. Returns token and user data

---

#### 3. Change Password
```http
POST /api/auth/change-password
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Application Routes (`/api/applications`)

**Protected**: Admin only

#### 1. Get All Applications
```http
GET /api/applications
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "applicationId": "APP000001",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "Pending",
      "department": "Computer Science",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### 2. Approve Application
```http
PUT /api/applications/:id/approve
```

**Workflow**:
1. Finds application by ID
2. Creates Student record
3. Creates User record with temporary password
4. Sends email with login credentials
5. Updates application status to 'Approved'

**Email Sent**:
- Subject: "Application Approved"
- Content: Login credentials and welcome message

---

#### 3. Reject Application
```http
PUT /api/applications/:id/reject
```

**Request Body**:
```json
{
  "reason": "Percentage below minimum requirement"
}
```

**Workflow**:
1. Updates application status to 'Rejected'
2. Stores rejection reason
3. Sends rejection email

---

### Student Routes (`/api/students`)

**Protected**: Admin and Faculty

#### 1. Get All Students
```http
GET /api/students
```

**Query Parameters**:
- `department`: Filter by department
- `semester`: Filter by semester
- `status`: Filter by status

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "studentId": "STU00001",
      "name": "John Doe",
      "email": "john@student.edu",
      "department": "Computer Science",
      "semester": 3,
      "gpa": 3.8,
      "status": "Active"
    }
  ]
}
```

---

#### 2. Get Student by ID
```http
GET /api/students/:id
```

**Response**: Complete student profile with subjects and performance data

---

#### 3. Update Student
```http
PUT /api/students/:id
```

**Protected**: Admin only

**Request Body**: Any student fields to update

---

### Faculty Routes (`/api/faculty`)

**Protected**: Admin

#### 1. Get All Faculty
```http
GET /api/faculty
```

#### 2. Get Faculty by ID
```http
GET /api/faculty/:id
```

#### 3. Create Faculty
```http
POST /api/faculty
```

**Request Body**:
```json
{
  "name": "Dr. John Smith",
  "email": "john.smith@university.edu",
  "phone": "+1234567890",
  "department": "Computer Science",
  "designation": "Professor",
  "qualification": "Ph.D. in Computer Science",
  "experience": 15,
  "salary": 95000
}
```

---

### Subject Routes (`/api/subjects`)

#### 1. Get All Subjects
```http
GET /api/subjects
```

#### 2. Create Subject
```http
POST /api/subjects
```

**Protected**: Admin only

**Request Body**:
```json
{
  "subjectCode": "CS101",
  "subjectName": "Data Structures",
  "department": "Computer Science",
  "course": "BCA",
  "semester": 3,
  "credits": 4,
  "faculty": "507f1f77bcf86cd799439011"
}
```

---

### Attendance Routes (`/api/attendance`)

#### 1. Mark Attendance
```http
POST /api/attendance
```

**Protected**: Faculty only

**Request Body**:
```json
{
  "subject": "507f1f77bcf86cd799439011",
  "date": "2024-01-15",
  "attendanceData": [
    {
      "student": "507f1f77bcf86cd799439012",
      "status": "Present"
    },
    {
      "student": "507f1f77bcf86cd799439013",
      "status": "Absent"
    }
  ]
}
```

---

#### 2. Get Attendance
```http
GET /api/attendance
```

**Query Parameters**:
- `student`: Student ID
- `subject`: Subject ID
- `startDate`: Start date
- `endDate`: End date

---

### Assignment Routes (`/api/assignments`)

#### 1. Create Assignment
```http
POST /api/assignments
```

**Protected**: Faculty only

**Content-Type**: `multipart/form-data`

**Form Data**:
- `title`: Assignment title
- `description`: Assignment description
- `subject`: Subject ID
- `dueDate`: Due date
- `totalMarks`: Total marks
- `file`: Assignment file (optional)

---

#### 2. Get Assignments
```http
GET /api/assignments
```

**For Faculty**: Returns all assignments created by them
**For Students**: Returns assignments for their subjects

---

#### 3. Submit Assignment
```http
POST /api/assignments/:id/submit
```

**Protected**: Student only

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: Submission file

---

#### 4. Grade Submission
```http
PUT /api/assignments/:assignmentId/submissions/:submissionId/grade
```

**Protected**: Faculty only

**Request Body**:
```json
{
  "marksObtained": 85,
  "feedback": "Good work!"
}
```

---

### Result Routes (`/api/results`)

#### 1. Submit Grades
```http
POST /api/results
```

**Protected**: Faculty only

**Request Body**:
```json
{
  "student": "507f1f77bcf86cd799439011",
  "subject": "507f1f77bcf86cd799439012",
  "semester": 3,
  "examType": "Final",
  "marksObtained": 85,
  "totalMarks": 100
}
```

---

#### 2. Get Student Results
```http
GET /api/results/student
```

**Protected**: Student only

**Response**: All results for logged-in student

---

### Fee Routes (`/api/fees`)

#### 1. Create Fee
```http
POST /api/fees
```

**Protected**: Admin only

**Request Body**:
```json
{
  "student": "507f1f77bcf86cd799439011",
  "title": "Semester Tuition",
  "description": "Tuition fee for Semester 3",
  "amount": 50000,
  "dueDate": "2024-02-01"
}
```

---

#### 2. Get My Fees
```http
GET /api/fees/myfees
```

**Protected**: Student only

**Response**: All fees for logged-in student

---

#### 3. Pay Fee
```http
PUT /api/fees/:id/pay
```

**Protected**: Student only

**Request Body**:
```json
{
  "paymentMethod": "Online Transfer"
}
```

**Workflow**:
1. Validates fee belongs to student
2. Checks if already paid
3. Updates status to 'Paid'
4. Generates transaction ID
5. Records payment date

---

### Announcement Routes (`/api/announcements`)

#### 1. Get All Announcements
```http
GET /api/announcements
```

**Response**: Announcements filtered by user role

---

#### 2. Create Announcement
```http
POST /api/announcements
```

**Protected**: Admin and Faculty

**Request Body**:
```json
{
  "title": "Holiday Notice",
  "content": "University will be closed on...",
  "targetAudience": "All",
  "priority": "High"
}
```

---

### Event Routes (`/api/events`)

#### 1. Get All Events
```http
GET /api/events
```

#### 2. Create Event
```http
POST /api/events
```

**Protected**: Admin only

**Request Body**:
```json
{
  "title": "Tech Fest 2024",
  "description": "Annual technology festival",
  "eventDate": "2024-03-15",
  "location": "Main Auditorium",
  "category": "Cultural"
}
```

---

## 🔐 Middleware

### 1. Authentication Middleware (`middleware/auth.js`)

**Function**: `protect`

**Purpose**: Verify JWT token and attach user to request

**Usage**:
```javascript
router.get('/protected-route', protect, controller);
```

**Process**:
1. Extracts token from Authorization header
2. Verifies token using JWT_SECRET
3. Finds user in database
4. Attaches user to `req.user`
5. Calls next middleware

**Error Responses**:
- 401: No token provided
- 401: Invalid token
- 401: User not found

---

### 2. Authorization Middleware (`middleware/auth.js`)

**Function**: `authorize(...roles)`

**Purpose**: Check if user has required role

**Usage**:
```javascript
router.post('/admin-only', protect, authorize('admin'), controller);
```

**Process**:
1. Checks if `req.user.role` matches allowed roles
2. If match: calls next middleware
3. If no match: returns 403 Forbidden

---

### 3. File Upload Middleware

**Library**: Multer

**Configuration**:
```javascript
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    // Accept only specific file types
  }
});
```

**Usage**:
```javascript
router.post('/upload', upload.single('file'), controller);
```

---

## 🔄 Authentication Flow

### Registration Flow

```
1. Student fills registration form
   ↓
2. POST /api/auth/register
   ↓
3. Create Application (status: Pending)
   ↓
4. Send confirmation email
   ↓
5. Admin reviews application
   ↓
6. Admin approves/rejects
   ↓
7. If approved:
   - Create Student record
   - Create User record
   - Send credentials email
   ↓
8. Student can login
```

---

### Login Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Validate email/password
   ↓
4. Check if approved
   ↓
5. Generate JWT token
   ↓
6. Return token + user data
   ↓
7. Frontend stores token
   ↓
8. Token sent in Authorization header for protected routes
```

---

### Protected Route Flow

```
1. Request to protected route
   ↓
2. Extract token from header
   ↓
3. Verify token
   ↓
4. Find user in database
   ↓
5. Check role authorization
   ↓
6. Attach user to request
   ↓
7. Execute controller
```

---

## 📁 File Structure Explained

```
backend/
├── config/
│   └── db.js              # MongoDB connection
│
├── controllers/           # Request handlers
│   ├── adminController.js
│   ├── announcementController.js
│   ├── applicationController.js
│   ├── assignmentController.js
│   ├── attendanceController.js
│   ├── authController.js
│   ├── eventController.js
│   ├── facultyController.js
│   ├── feeController.js
│   ├── resultController.js
│   ├── studentController.js
│   └── subjectController.js
│
├── middleware/
│   ├── auth.js            # Authentication & authorization
│   └── errorHandler.js    # Error handling
│
├── models/                # Mongoose schemas
│   ├── Admin.js
│   ├── Announcement.js
│   ├── Application.js
│   ├── Assignment.js
│   ├── Attendance.js
│   ├── Event.js
│   ├── Faculty.js
│   ├── Fee.js
│   ├── Result.js
│   ├── Student.js
│   ├── Subject.js
│   ├── Submission.js
│   └── User.js
│
├── routes/                # API endpoints
│   ├── adminRoutes.js
│   ├── announcementRoutes.js
│   ├── applicationRoutes.js
│   ├── assignmentRoutes.js
│   ├── attendanceRoutes.js
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── facultyRoutes.js
│   ├── feeRoutes.js
│   ├── resultRoutes.js
│   ├── studentRoutes.js
│   └── subjectRoutes.js
│
├── utils/
│   └── emailService.js    # Email sending utility
│
├── uploads/               # File uploads storage
│
├── .env                   # Environment variables
├── .env.example           # Environment template
├── server.js              # Entry point
└── package.json           # Dependencies
```

---

## 🌍 Environment Setup

### Required Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/umsystem

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Email Configuration (Gmail example)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

---

## 🚀 Running the Backend

### Development Mode

```bash
cd backend
npm install
node seed.js  # Create admin account
npm start     # or: node server.js
```

Server runs on `http://localhost:5000`

### Production Mode

```bash
npm install --production
NODE_ENV=production node server.js
```

---

## 🔍 API Testing

### Using Postman

1. **Login**:
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "admin@university.edu", "password": "admin123", "role": "admin" }`
   - Copy the token from response

2. **Protected Route**:
   - Add header: `Authorization: Bearer <your_token>`
   - Make request to any protected endpoint

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@university.edu","password":"admin123","role":"admin"}'

# Protected route
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer <your_token>"
```

---

## 📊 Database Indexes

For optimal performance, create these indexes:

```javascript
// User
User.index({ email: 1 });

// Student
Student.index({ studentId: 1 });
Student.index({ email: 1 });

// Faculty
Faculty.index({ facultyId: 1 });
Faculty.index({ email: 1 });

// Application
Application.index({ applicationId: 1 });
Application.index({ status: 1 });

// Attendance
Attendance.index({ student: 1, subject: 1, date: 1 });

// Result
Result.index({ student: 1, semester: 1 });
```

---

## 🛡️ Security Best Practices

1. **Password Hashing**: All passwords hashed with bcrypt (10 rounds)
2. **JWT Expiration**: Tokens expire after 30 days
3. **Input Validation**: All inputs validated before processing
4. **SQL Injection Prevention**: Mongoose handles query sanitization
5. **CORS**: Configured to allow only frontend origin
6. **Rate Limiting**: Consider adding express-rate-limit for production
7. **Helmet**: Consider adding helmet.js for security headers

---

## 📝 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development)"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## 🔄 Data Flow Examples

### Example 1: Student Submits Assignment

```
1. Student uploads file
   ↓
2. POST /api/assignments/:id/submit
   ↓
3. Multer saves file to uploads/
   ↓
4. Create Submission record
   ↓
5. Link file path to submission
   ↓
6. Update status to 'Submitted'
   ↓
7. Return success response
```

### Example 2: Faculty Marks Attendance

```
1. Faculty selects subject and date
   ↓
2. Frontend fetches student list
   ↓
3. Faculty marks each student
   ↓
4. POST /api/attendance (batch)
   ↓
5. Create Attendance records
   ↓
6. Calculate attendance percentage
   ↓
7. Return updated data
```

### Example 3: Admin Approves Application

```
1. Admin clicks "Approve"
   ↓
2. PUT /api/applications/:id/approve
   ↓
3. Create Student record
   ↓
4. Generate studentId (STU00XXX)
   ↓
5. Create User record
   ↓
6. Generate temporary password
   ↓
7. Send email with credentials
   ↓
8. Update application status
   ↓
9. Return success response
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration
- [ ] User login (all roles)
- [ ] Application approval workflow
- [ ] Student CRUD operations
- [ ] Faculty CRUD operations
- [ ] Subject management
- [ ] Attendance marking
- [ ] Assignment creation and submission
- [ ] Grade entry
- [ ] Fee creation and payment
- [ ] Announcement creation
- [ ] Event management

### Automated Testing (Future)

Consider adding:
- Unit tests with Jest
- Integration tests with Supertest
- API endpoint testing
- Database seeding for tests

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: MongoDB connection failed
- **Solution**: Check if MongoDB is running, verify MONGODB_URI

**Issue**: Email not sending
- **Solution**: Verify EMAIL_USER and EMAIL_PASS, check Gmail app password

**Issue**: JWT token invalid
- **Solution**: Ensure JWT_SECRET is set, check token expiration

**Issue**: File upload fails
- **Solution**: Check uploads/ directory permissions, verify file size limits

---

**Backend documentation complete. For frontend details, see [FRONTEND.md](./FRONTEND.md)**
