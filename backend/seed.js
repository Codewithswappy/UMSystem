import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/umsystem', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB Connected');

        // Check if admin user already exists
        let existingUser = await User.findOne({ email: 'admin@university.edu' });

        if (existingUser) {
            console.log('⚠️  Admin user already exists');
            console.log('📧 Email: admin@university.edu');
            console.log('🔑 Password: admin123');
            console.log('✨ You can login with these credentials!');
            process.exit(0);
        }

        // Check if Admin record exists
        let admin = await Admin.findOne({ email: 'admin@university.edu' });

        if (!admin) {
            // Create Admin record
            admin = await Admin.create({
                name: 'Admin User',
                email: 'admin@university.edu',
                password: 'admin123', // Will be hashed automatically
                phone: '+1 234 567 8900',
                role: 'Super Admin',
                department: 'Administration'
            });
            console.log('✅ Admin record created');
        } else {
            console.log('ℹ️  Admin record already exists, creating User record...');
        }

        // Create User record for authentication
        const user = await User.create({
            email: 'admin@university.edu',
            password: 'admin123', // Will be hashed automatically
            role: 'admin',
            isApproved: true,
            mustChangePassword: false,
            adminId: admin._id,
            name: 'Admin User'
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@university.edu');
        console.log('🔑 Password: admin123');
        console.log('🆔 Admin ID:', admin._id);
        console.log('🆔 User ID:', user._id);
        console.log('\n✨ You can now login with these credentials!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

seedAdmin();
