const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importing the User model

// Middleware to verify the JWT token
exports.verifyToken = async (req, res, next) => {
    try {
        // Get token from the request header
        const token = req.headers['authorization'];

        // Check if no token is provided
        if (!token) {
            return res.status(403).json({ message: 'No token provided. Access denied.' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token.' });
            }

            // Fetch the user based on the decoded token's userId
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            // Check if the user's account is active
            if (!user.isActive) {
                return res.status(403).json({ message: 'User account is inactive.' });
            }

            // Check if two-factor authentication is enabled
            if (user.twoFactorAuth.isEnabled && !req.headers['x-2fa-token']) {
                return res.status(403).json({ message: 'Two-factor authentication required.' });
            }

            // Store the user information in the request
            req.user = {
                id: user._id,
                role: user.role,
                profileCompleteness: user.profileCompleteness,
            };

            // Proceed to the next middleware or route handler
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify token.', error });
    }
};

// Middleware to check if the user has a specific role
exports.verifyRole = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. ${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)}s only.` });
    }

    // Proceed to the next middleware or route handler
    next();
};

// Middleware to check if the user has a minimum profile completeness
exports.verifyProfileCompleteness = (minCompleteness) => (req, res, next) => {
    if (req.user.profileCompleteness < minCompleteness) {
        return res.status(403).json({ message: `Profile incomplete. Minimum ${minCompleteness}% profile completeness required.` });
    }

    // Proceed to the next middleware or route handler
    next();
};

// Admin middleware for convenience
exports.verifyAdmin = exports.verifyRole('admin');

// Parent middleware for convenience
exports.verifyParent = exports.verifyRole('parent');

// Educator middleware for convenience
exports.verifyEducator = exports.verifyRole('educator');
