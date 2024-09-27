const jwt = require('jsonwebtoken');

// Middleware to verify the JWT token
exports.verifyToken = (req, res, next) => {
    // Get token from the request header
    const token = req.headers['authorization'];

    // Check if no token is provided
    if (!token) {
        return res.status(403).json({ message: 'No token provided. Access denied.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }

        // If the token is verified, store the decoded user ID in the request
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        // Proceed to the next middleware or route handler
        next();
    });
};

// Middleware to check for admin role (if applicable)
exports.verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Proceed to the next middleware or route handler
    next();
};

// Middleware to check if user has a parent role (if applicable)
exports.verifyParent = (req, res, next) => {
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Access denied. Parents only.' });
    }

    // Proceed to the next middleware or route handler
    next();
};
