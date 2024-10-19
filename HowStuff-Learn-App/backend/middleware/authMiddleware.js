const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importing the User model

// Middleware to verify the JWT token
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from "Bearer <token>"
        if (!token) {
            return res.status(403).json({ message: 'No token provided. Access denied.' });
        }
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err);
                const message = err.name === 'TokenExpiredError' 
                    ? 'Token has expired. Please log in again.' 
                    : 'Failed to authenticate token.';
                return res.status(401).json({ message });
            }
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            if (!user.isActive) {
                return res.status(403).json({ message: 'User account is inactive.' });
            }
            if (user.twoFactorAuth?.isEnabled && !req.headers['x-2fa-token']) {
                return res.status(403).json({ message: 'Two-factor authentication required.' });
            }
            req.user = {
                id: user._id,
                role: user.role,
                profileCompleteness: user.profileCompleteness,
            };
            next();
        });
    } catch (error) {
        console.error('JWT Middleware Error:', error);
        res.status(500).json({ message: 'Failed to verify token.', error: error.message });
    }
};

// Middleware to check if the user has a specific role
exports.verifyRole = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. ${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)}s only.` });
    }
    next();
};

// Middleware to check if the user has a minimum profile completeness
exports.verifyProfileCompleteness = (minCompleteness) => (req, res, next) => {
    if (req.user.profileCompleteness < minCompleteness) {
        return res.status(403).json({ message: `Profile incomplete. Minimum ${minCompleteness}% profile completeness required.` });
    }
    next();
};

// Admin middleware for convenience
exports.verifyAdmin = exports.verifyRole('admin');

// Parent middleware for convenience
exports.verifyParent = exports.verifyRole('parent');

// Educator middleware for convenience
exports.verifyEducator = exports.verifyRole('educator');
