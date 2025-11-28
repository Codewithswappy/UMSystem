import nodemailer from 'nodemailer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Generate random password
export const generateTemporaryPassword = () => {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Create transporter with verified settings
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        throw new Error('EMAIL_USER or EMAIL_PASSWORD not configured in .env');
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Helper to get logo attachment
const getLogoAttachment = () => {
    try {
        // Try to locate the logo in frontend/public
        const logoPath = path.join(process.cwd(), '../frontend/public/Logo2.png');
        if (fs.existsSync(logoPath)) {
            return [{
                filename: 'logo.png',
                path: logoPath,
                cid: 'universityLogo' // same cid value as in the html img src
            }];
        }
        console.warn('⚠️ Logo file not found at:', logoPath);
        return [];
    } catch (error) {
        console.warn('⚠️ Error loading logo:', error.message);
        return [];
    }
};

// Common HTML Template
const getHtmlTemplate = (title, content, name) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f9fa; color: #333; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: #ffffff; padding: 40px 40px 20px 40px; text-align: center; border-bottom: 1px solid #f0f0f0; }
        .logo { height: 60px; width: auto; object-fit: contain; }
        .content { padding: 40px; }
        .h1 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px 0; letter-spacing: -0.5px; }
        .p { font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 24px 0; }
        .box { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 24px; margin: 32px 0; }
        .box-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #868e96; font-weight: 600; margin-bottom: 8px; display: block; }
        .box-value { font-size: 18px; font-family: 'Monaco', 'Consolas', monospace; color: #212529; font-weight: 500; word-break: break-all; }
        .btn { display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.2s; }
        .footer { background: #f8f9fa; padding: 32px; text-align: center; border-top: 1px solid #f0f0f0; }
        .footer-text { font-size: 13px; color: #868e96; margin: 4px 0; }
        .divider { height: 1px; background: #f0f0f0; margin: 24px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="cid:universityLogo" alt="University Logo" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">${title}</h1>
            <p class="p">Dear ${name},</p>
            ${content}
            
            <p class="p" style="margin-top: 40px;">
                Best regards,<br>
                <strong style="color: #000;">Admissions Office</strong><br>
                <span style="color: #868e96;">University Management System</span>
            </p>
        </div>
        <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} University Management System. All rights reserved.</p>
            <p class="footer-text">This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
    `;
};

// Send approval email with credentials
export const sendApprovalEmail = async (email, name, studentId, temporaryPassword) => {
    console.log(`📧 Sending approval email to ${email}...`);

    try {
        const transporter = createTransporter();
        const logoAttachment = getLogoAttachment();

        const content = `
            <p class="p">We are pleased to inform you that your application to the University Management System has been <strong>approved</strong>.</p>
            
            <div class="box">
                <div style="margin-bottom: 20px;">
                    <span class="box-label">Student ID</span>
                    <div class="box-value">${studentId}</div>
                </div>
                <div style="margin-bottom: 20px;">
                    <span class="box-label">Email Address</span>
                    <div class="box-value">${email}</div>
                </div>
                <div>
                    <span class="box-label">Temporary Password</span>
                    <div class="box-value" style="color: #228be6;">${temporaryPassword}</div>
                </div>
            </div>

            <p class="p">Please log in to your student portal to complete your profile setup. You will be required to change your password upon your first login.</p>

            <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="btn">Access Student Portal</a>
            </div>
        `;

        const mailOptions = {
            from: `"University Admissions" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Application Approved - Welcome to UMS',
            html: getHtmlTemplate('Welcome to UMS', content, name),
            attachments: logoAttachment
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        return { success: false, error: error.message };
    }
};

// Send rejection email
export const sendRejectionEmail = async (email, name, reason) => {
    console.log(`📧 Sending rejection email to ${email}...`);

    try {
        const transporter = createTransporter();
        const logoAttachment = getLogoAttachment();

        const content = `
            <p class="p">Thank you for your interest in our university.</p>
            <p class="p">After careful review of your application, we regret to inform you that we are unable to offer you admission at this time.</p>
            
            ${reason ? `
            <div class="box" style="background: #fff5f5; border-color: #ffe3e3;">
                <span class="box-label" style="color: #fa5252;">Reason for Decision</span>
                <div class="p" style="margin: 8px 0 0 0; color: #495057;">${reason}</div>
            </div>
            ` : ''}

            <p class="p">We appreciate the time and effort you put into your application and wish you the best in your future academic pursuits.</p>
        `;

        const mailOptions = {
            from: `"University Admissions" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Update on Your Application',
            html: getHtmlTemplate('Application Status Update', content, name),
            attachments: logoAttachment
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Rejection email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        return { success: false, error: error.message };
    }
};

// Send faculty credentials email
export const sendFacultyCredentialsEmail = async (email, name, facultyId, temporaryPassword) => {
    console.log(`📧 Sending faculty credentials email to ${email}...`);

    try {
        const transporter = createTransporter();
        const logoAttachment = getLogoAttachment();

        const content = `
            <p class="p">Welcome to the academic team! Your faculty account has been created successfully.</p>
            
            <div class="box">
                <div style="margin-bottom: 20px;">
                    <span class="box-label">Faculty ID</span>
                    <div class="box-value">${facultyId}</div>
                </div>
                <div style="margin-bottom: 20px;">
                    <span class="box-label">Email Address</span>
                    <div class="box-value">${email}</div>
                </div>
                <div>
                    <span class="box-label">Temporary Password</span>
                    <div class="box-value" style="color: #228be6;">${temporaryPassword}</div>
                </div>
            </div>

            <p class="p">Please log in to the faculty portal to complete your profile setup. You will be required to change your password upon your first login.</p>

            <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="btn">Access Faculty Portal</a>
            </div>
        `;

        const mailOptions = {
            from: `"University HR" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to the Faculty Team - Account Credentials',
            html: getHtmlTemplate('Welcome to the Team', content, name),
            attachments: logoAttachment
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Faculty email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('❌ Faculty email sending failed:', error.message);
        return { success: false, error: error.message };
    }
};
