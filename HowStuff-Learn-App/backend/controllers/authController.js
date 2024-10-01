const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog'); // Import the AuditLog model
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

        // Log the registration
        await logAudit('User Registered', user._id, `User ${email} registered`);

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

        // Log the login
        await logAudit('User Login', user._id, `User ${email} logged in`);

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

        // Log the password reset request
        await logAudit('Password Reset Requested', user._id, `Password reset requested for ${email}`);
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

        // Log the password reset
        await logAudit('Password Reset', user._id, `Password reset successfully for ${user.email}`);
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

        // Log the email verification
        await logAudit('Email Verified', user._id, `Email verified for ${user.email}`);
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
        // Send email verification for the new email
        await sendEmailChangeVerification(user.newEmail, emailChangeToken);
        res.status(200).json({ message: 'Verification email sent to the new email address.' });

        // Log the email change request
        await logAudit('Email Change Requested', user._id, `Email change requested from ${user.email} to ${user.newEmail}`);
    } catch (error) {
        res.status(500).json({ message: 'Error requesting email change', error: error.message });
    }
};

// Confirm Email Change
exports.confirmEmailChange = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            emailChangeToken: token,
            emailChangeExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.email = user.newEmail; // Update the user's email
        user.emailChangeToken = undefined;
        user.newEmail = undefined;
        user.emailChangeExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Email changed successfully' });

        // Log the email change
        await logAudit('Email Changed', user._id, `Email changed to ${user.email}`);
    } catch (error) {
        res.status(500).json({ message: 'Error confirming email change', error: error.message });
    }
};


// Utility Functions
const logAudit = async (action, userId, description) => {
    const auditLog = new AuditLog({ action, userId, description, timestamp: new Date() });
    await auditLog.save();
};

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const generate2FACode = () => {
    return crypto.randomBytes(3).toString('hex'); // Generates a simple 6-digit hex code
};

const sendVerificationEmail = async (user) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email provider
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the link: 
        http://yourdomain.com/verify/${user.verificationToken}`,
    };

    await transporter.sendMail(mailOptions);
};

const sendResetEmail = async (user, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset',
        text: `To reset your password, click the following link: 
        http://yourdomain.com/reset/${resetToken}`,
    };

    await transporter.sendMail(mailOptions);
};

const send2FACode = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your 2FA Code',
        text: `Your 2FA code is: ${code}`,
    };

    await transporter.sendMail(mailOptions);
};

const sendEmailChangeVerification = async (newEmail, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: newEmail,
        subject: 'Verify Your New Email Address',
        text: `To confirm your email change, please click the link: 
        http://yourdomain.com/confirm-email/${token}`,
    };

    await transporter.sendMail(mailOptions);
};


