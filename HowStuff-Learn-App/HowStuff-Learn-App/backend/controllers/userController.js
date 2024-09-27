// Import necessary modules
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
exports.register = async (req, res) => {
    const { name, email, password, childAccount } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            childAccount,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Link child's account
exports.linkChildAccount = async (req, res) => {
    const { childAccount } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.childAccount = childAccount;
        await user.save();
        res.status(200).json({ message: 'Child account linked successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error linking child account', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
};
