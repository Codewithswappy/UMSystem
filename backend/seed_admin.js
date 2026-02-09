import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/umsystem');
        console.log('Connected to DB');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@ums.com' });
        if (adminExists) {
            console.log('Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@ums.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created: admin@ums.com / admin123');

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected'); 
    }
};

seedAdmin();
