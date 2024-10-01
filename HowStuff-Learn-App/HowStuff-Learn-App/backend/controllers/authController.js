const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const TokenBlacklist = require('../models/TokenBlacklist');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Constants for failed attempts
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 3600000; // 1 hour

// Configure rate limiter
const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});

// Register User
exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // Validate email and password
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role });
        await user.save();

        // Send verification email
        sendVerificationEmail(user);

        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await rateLimiter.consume(email);

        const user = await User.findOne({ email });
        if (!user || !user.isVerified) {
            return res.status(404).json({ message: 'User not found or not verified' });
        }

        // Lockout logic
        if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS && user.lockedUntil > Date.now()) {
            return res.status(403).json({ message: 'Account locked. Please try again later.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            // Lock the account if exceeded maximum attempts
            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockedUntil = Date.now() + LOCKOUT_DURATION;
            }

            await user.save();
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Reset failed login attempts on successful login
        user.failedLoginAttempts = 0;
        user.lockedUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

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
        await TokenBlacklist.create({ token });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};

// Refresh Token
exports.refreshToken = (req, res) => {
    const { token } = req.body;
    try {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });
            const accessToken = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error refreshing token', error: error.message });
    }
};

// Forgot Password - Send Reset Token
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendResetEmail(user, resetToken);
        res.status(200).json({ message: 'Reset token sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reset token', error: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
};

// Two-Factor Authentication (2FA)
exports.enableTwoFactorAuth = async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.is2FAEnabled = true;
    user.verificationCode = generate2FACode();
    await user.save();

    // Send 2FA code via email/SMS (implementation required)
    send2FACode(user.email, user.verificationCode);

    res.status(200).json({ message: '2FA enabled and code sent' });
};

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
// Email Change Request
exports.requestEmailChange = async (req, res) => {
    const { userId, newEmail } = req.body;
    try {
        // Validate new email format
        if (!validateEmail(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate a verification token for the new email
        const emailChangeToken = crypto.randomBytes(20).toString('hex');
        user.emailChangeToken = emailChangeToken;
        user.newEmail = newEmail;
        user.emailChangeExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send verification email
        await sendEmailChangeVerification(user.newEmail, emailChangeToken);

        res.status(200).json({ message: 'Email change request initiated. Please verify your new email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing email change request', error: error.message });
    }
};

// Verify New Email
exports.verifyEmailChange = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            emailChangeToken: token,
            emailChangeExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.email = user.newEmail;
        user.newEmail = undefined; // Clear the new email
        user.emailChangeToken = undefined; // Clear the token
        user.emailChangeExpires = undefined; // Clear the expiry
        await user.save();

        res.status(200).json({ message: 'Email changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email change', error: error.message });
    }
};

// Utility Function to Send Email Change Verification Email
const sendEmailChangeVerification = async (newEmail, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        to: newEmail,
        from: process.env.EMAIL,
        subject: 'Email Change Verification',
        text: `Please verify your email change by clicking on the following link: ${process.env.APP_URL}/verify-email-change/${token}`
    };

    await transporter.sendMail(mailOptions);
};

// Utility Functions
const sendVerificationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: ${process.env.APP_URL}/verify-email/${user._id}`
    };

    await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (user, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset',
        text: `Please use the following token to reset your password: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);
};


const send2FACode = (email, code) => {
    // Implement sending the 2FA code via email or SMS
};

const generate2FACode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
