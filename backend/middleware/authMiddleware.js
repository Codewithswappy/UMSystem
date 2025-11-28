import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (token contains userId, not id)
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                console.error('User not found for ID:', decoded.userId);
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, user not found. Please log out and log in again.'
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
