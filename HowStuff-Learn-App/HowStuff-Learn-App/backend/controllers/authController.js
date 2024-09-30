const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const TokenBlacklist = require('../models/TokenBlacklist');
const { RateLimiterMemory } = require('rate-limiter-flexible'); // Rate limiter for brute-force protection

// Configure rate limiter
const rateLimiter = new RateLimiterMemory({
    points: 5, // Number of allowed attempts
    duration: 60, // Time window in seconds
});

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await rateLimiter.consume(email); // Rate limiting

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login timestamp
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT and refresh token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', token, refreshToken, role: user.role });
    } catch (error) {
        if (error instanceof RateLimiterRes) {
            return res.status(429).json({ message: 'Too many login attempts, please try again later.' });
        }
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Logout User
exports.logout = async (req, res) => {
    const { token } = req.body;

    try {
        // Add token to blacklist
        await TokenBlacklist.create({ token });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};

// Middleware to refresh tokens
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    try {
        const isBlacklisted = await TokenBlacklist.findOne({ token: refreshToken });
        if (isBlacklisted) {
            return res.sendStatus(403); // Forbidden
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.sendStatus(403); // Forbidden
        }

        const newToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: newToken });
    } catch (error) {
        res.status(500).json({ message: 'Error refreshing token', error: error.message });
    }
};

// 2FA Middleware
exports.verifyTwoFactorAuth = async (req, res) => {
    const { userId, verificationCode } = req.body;
    const user = await User.findById(userId);
    
    if (!user || user.verificationCode !== verificationCode) {
        return res.status(401).json({ message: 'Invalid verification code' });
    }

    user.verificationCode = null; // Clear the code after verification
    await user.save();
    res.status(200).json({ message: '2FA verified successfully' });
};

// Generate 2FA Code
exports.generateTwoFactorAuthCode = async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate and store a new verification code (this could be a random number, etc.)
    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    await user.save();

    // Send the verification code via email or SMS (implementation not shown)
    // sendVerificationCode(user.email, user.verificationCode);

    res.status(200).json({ message: '2FA code generated and sent' });
};
