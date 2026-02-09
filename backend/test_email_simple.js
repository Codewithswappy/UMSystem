
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Verify Error:', error);
  } else {
    console.log('✅ Server is ready to take our messages');
    
    // Send mail
    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Test Email from UMS",
        text: "It works!"
    }, (err, info) => {
        if (err) console.log('❌ Send Error:', err);
        else console.log('✅ Email sent:', info.response);
    });
  }
});
