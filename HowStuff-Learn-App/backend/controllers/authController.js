const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const TokenBlacklist = require('../models/TokenBlacklist');
const { RateLimiterMemory, RateLimiterRes } = require('rate-limiter-flexible');
const { generateContentWithAI } = require('../utils/aiUtility');

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
    const { email, password, role, educationLevel } = req.body;
    try {
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role, educationLevel });
        await user.save();

        // Log the registration
        await logAudit('User Registered', user._id, `User ${email} registered`);

        // Send verification email
        sendVerificationEmail(user);

        // Generate personalized onboarding content based on user's educational level
        const onboardingContent = await generateContentWithAI(educationLevel);

        res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
            onboardingContent // Send the personalized onboarding content
        });
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

        if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS && user.lockedUntil > Date.now()) {
            return res.status(403).json({ message: 'Account locked. Please try again later.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockedUntil = Date.now() + LOCKOUT_DURATION;
            }

            await user.save();
            return res.status(401).json({ message: 'Invalid credentials' });
        }

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

// Utility Functions

// Log audit actions
const logAudit = async (action, userId, description) => {
    const auditLog = new AuditLog({ action, userId, description, timestamp: new Date() });
    await auditLog.save();
};

// Validate email format
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Send verification email
const sendVerificationEmail = async (user, host) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Account Verification',
            text: `Hello ${user.email},\n\nPlease verify your email by clicking on the following link: \n\nhttp://${host}/verify-email/${user._id} \n\nIf you did not request this, please ignore this email.\n`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Error sending verification email');
    }
};

// Send password reset email
const sendResetEmail = async (user, token, host) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // sender address
            to: user.email, // list of receivers
            subject: 'Password Reset Request',
            text: `Hello ${user.email},\n\nPlease reset your password by clicking on the following link: \n\nhttp://${host}/reset-password/${token} \n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending reset email:', error);
        throw new Error('Error sending reset email');
    }
};

// Send 2FA code
const send2FACode = async (email, code) => {
    try {
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
            subject: 'Your Two-Factor Authentication Code',
            text: `Your 2FA code is: ${code}. It will expire in 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending 2FA code:', error);
        throw new Error('Error sending 2FA code');
    }
};

// Generate a secure random 6-digit 2FA code
const generate2FACode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Validate 2FA code
const validate2FACode = (user, code) => {
    const currentTime = new Date();
    const timeDifference = (currentTime - user.twoFactorAuth.createdAt) / (1000 * 60); // Difference in minutes

    // Validate if the code matches and is not expired (valid for 10 minutes)
    if (user.twoFactorAuth.code === code && timeDifference <= 10) {
        return true;
    }
    return false;
};

// Hash password using bcrypt
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Verify password hash
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// Generate a JWT token for authentication
const generateAuthToken = (user) => {
    const payload = { userId: user._id, role: user.role };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};

// Validate JWT token
const validateAuthToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        return jwt.verify(token, secret);
    } catch (error) {
        return null; // Token is invalid
    }
};

// Generate a password reset token
const generatePasswordResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Validate password strength
const validatePasswordStrength = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
};

module.exports = {
    logAudit,
    validateEmail,
    sendVerificationEmail,
    sendResetEmail,
    send2FACode,
    generate2FACode,
    validate2FACode,
    hashPassword,
    verifyPassword,
    generateAuthToken,
    validateAuthToken,
    generatePasswordResetToken,
    validatePasswordStrength,
};
