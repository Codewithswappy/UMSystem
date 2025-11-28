import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Faculty from './models/Faculty.js';
import Application from './models/Application.js';

dotenv.config();

const sampleData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/umsystem', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected');

        // Clear existing data
        await Student.deleteMany({});
        await Faculty.deleteMany({});
        await Application.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create sample students
        const students = await Student.create([
            {
                studentId: 'STU00001',
                name: 'John Doe',
                email: 'john.doe@student.edu',
                phone: '+1 234 567 8901',
                dateOfBirth: new Date('2002-05-15'),
                gender: 'Male',
                address: '123 Main St, City, State 12345',
                department: 'Computer Science',
                semester: 3,
                status: 'Active',
                gpa: 3.8
            },
            {
                studentId: 'STU00002',
                name: 'Jane Smith',
                email: 'jane.smith@student.edu',
                phone: '+1 234 567 8902',
                dateOfBirth: new Date('2003-08-22'),
                gender: 'Female',
                address: '456 Oak Ave, City, State 12345',
                department: 'Electrical Engineering',
                semester: 2,
                status: 'Active',
                gpa: 3.9
            },
            {
                studentId: 'STU00003',
                name: 'Mike Johnson',
                email: 'mike.johnson@student.edu',
                phone: '+1 234 567 8903',
                dateOfBirth: new Date('2002-11-30'),
                gender: 'Male',
                address: '789 Pine Rd, City, State 12345',
                department: 'Mechanical Engineering',
                semester: 4,
                status: 'Active',
                gpa: 3.6
            }
        ]);
        console.log(`✅ Created ${students.length} students`);

        // Create sample faculty
        const faculty = await Faculty.create([
            {
                facultyId: 'FAC00001',
                name: 'Dr. Sarah Williams',
                email: 'sarah.williams@university.edu',
                phone: '+1 234 567 9001',
                dateOfBirth: new Date('1980-03-10'),
                gender: 'Female',
                address: '111 Faculty Lane, City, State 12345',
                department: 'Computer Science',
                designation: 'Professor',
                qualification: 'Ph.D. in Computer Science',
                experience: 15,
                salary: 95000,
                status: 'Active',
                subjects: ['Data Structures', 'Algorithms', 'Database Systems']
            },
            {
                facultyId: 'FAC00002',
                name: 'Dr. Robert Brown',
                email: 'robert.brown@university.edu',
                phone: '+1 234 567 9002',
                dateOfBirth: new Date('1975-07-25'),
                gender: 'Male',
                address: '222 Professor St, City, State 12345',
                department: 'Electrical Engineering',
                designation: 'Associate Professor',
                qualification: 'Ph.D. in Electrical Engineering',
                experience: 12,
                salary: 85000,
                status: 'Active',
                subjects: ['Circuit Analysis', 'Digital Electronics', 'Power Systems']
            },
            {
                facultyId: 'FAC00003',
                name: 'Dr. Emily Davis',
                email: 'emily.davis@university.edu',
                phone: '+1 234 567 9003',
                dateOfBirth: new Date('1985-12-05'),
                gender: 'Female',
                address: '333 Academic Blvd, City, State 12345',
                department: 'Mechanical Engineering',
                designation: 'Assistant Professor',
                qualification: 'Ph.D. in Mechanical Engineering',
                experience: 8,
                salary: 75000,
                status: 'Active',
                subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design']
            }
        ]);
        console.log(`✅ Created ${faculty.length} faculty members`);

        // Create sample applications
        const applications = await Application.create([
            {
                applicationId: 'APP000001',
                name: 'Alice Cooper',
                email: 'alice.cooper@email.com',
                phone: '+1 234 567 7001',
                dateOfBirth: new Date('2004-02-14'),
                gender: 'Female',
                address: '444 Student Ave, City, State 12345',
                department: 'Computer Science',
                previousEducation: 'High School Diploma',
                percentage: 92.5,
                status: 'Pending'
            },
            {
                applicationId: 'APP000002',
                name: 'Bob Wilson',
                email: 'bob.wilson@email.com',
                phone: '+1 234 567 7002',
                dateOfBirth: new Date('2003-09-20'),
                gender: 'Male',
                address: '555 Applicant Rd, City, State 12345',
                department: 'Electrical Engineering',
                previousEducation: 'High School Diploma',
                percentage: 88.0,
                status: 'Pending'
            },
            {
                applicationId: 'APP000003',
                name: 'Carol Martinez',
                email: 'carol.martinez@email.com',
                phone: '+1 234 567 7003',
                dateOfBirth: new Date('2004-06-18'),
                gender: 'Female',
                address: '666 Prospect St, City, State 12345',
                department: 'Mechanical Engineering',
                previousEducation: 'High School Diploma',
                percentage: 90.5,
                status: 'Pending'
            },
            {
                applicationId: 'APP000004',
                name: 'David Lee',
                email: 'david.lee@email.com',
                phone: '+1 234 567 7004',
                dateOfBirth: new Date('2003-11-25'),
                gender: 'Male',
                address: '777 Candidate Ln, City, State 12345',
                department: 'Computer Science',
                previousEducation: 'High School Diploma',
                percentage: 85.0,
                status: 'Approved',
                reviewedDate: new Date()
            },
            {
                applicationId: 'APP000005',
                name: 'Eva Garcia',
                email: 'eva.garcia@email.com',
                phone: '+1 234 567 7005',
                dateOfBirth: new Date('2004-04-30'),
                gender: 'Female',
                address: '888 Hopeful Way, City, State 12345',
                department: 'Electrical Engineering',
                previousEducation: 'High School Diploma',
                percentage: 78.0,
                status: 'Rejected',
                reviewedDate: new Date(),
                rejectionReason: 'Percentage below minimum requirement'
            }
        ]);
        console.log(`✅ Created ${applications.length} applications`);

        console.log('\n🎉 Sample data created successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Students: ${students.length}`);
        console.log(`   Faculty: ${faculty.length}`);
        console.log(`   Applications: ${applications.length}`);
        console.log(`     - Pending: ${applications.filter(a => a.status === 'Pending').length}`);
        console.log(`     - Approved: ${applications.filter(a => a.status === 'Approved').length}`);
        console.log(`     - Rejected: ${applications.filter(a => a.status === 'Rejected').length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating sample data:', error.message);
        process.exit(1);
    }
};

sampleData();
