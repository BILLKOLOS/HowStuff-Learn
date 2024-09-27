// Import necessary modules
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ResourceService = require('../utils/resourceService'); // Service to handle OpenAI and Wikipedia integration

// User registration
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({
            username,
            email,
            password,
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

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Create a child account
exports.createChildAccount = async (req, res) => {
    const { username, email, password } = req.body; // Details for the child account
    const userId = req.user.id; // Parent's user ID

    try {
        const newChild = new User({
            username,
            email,
            password,
            role: 'child', // Set role as child
        });

        await newChild.save();

        // Link the child account to the parent
        const user = await User.findById(userId);
        user.children.push(newChild._id);
        await user.save();

        res.status(201).json({ message: 'Child account created successfully', child: newChild });
    } catch (error) {
        res.status(500).json({ message: 'Error creating child account', error: error.message });
    }
};

// Link child's account
exports.linkChildAccount = async (req, res) => {
    const { childAccount } = req.body; // Assuming childAccount is an ObjectId
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.children.push(childAccount); // Use children array
        await user.save();
        res.status(200).json({ message: 'Child account linked successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error linking child account', error: error.message });
    }
};

// Unlink child's account
exports.unlinkChildAccount = async (req, res) => {
    const { childAccountId } = req.body; // ID of the child account to unlink
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.children = user.children.filter(childId => childId.toString() !== childAccountId);
        await user.save();
        res.status(200).json({ message: 'Child account unlinked successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error unlinking child account', error: error.message });
    }
};

// View child's accounts
exports.viewChildAccounts = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('children'); // Populate child accounts
        res.status(200).json({ message: 'Child accounts retrieved successfully', children: user.children });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving child accounts', error: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByIdAndUpdate(userId, { username, email }, { new: true });
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

// Search resources
exports.searchResources = async (req, res) => {
    const { query } = req.query;

    try {
        const results = await ResourceService.search(query);

        // Save search history
        await exports.saveSearchHistory(req, res, query, results);

        res.status(200).json({ message: 'Search results retrieved successfully', results });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching search results', error: error.message });
    }
};

// Save user search history
exports.saveSearchHistory = async (req, res, searchQuery, results) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        user.searchHistory.push({ query: searchQuery, results });
        await user.save();
    } catch (error) {
        console.error('Error saving search history:', error.message);
    }
};

// Retrieve user search history
exports.getSearchHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select('searchHistory');
        res.status(200).json({ message: 'Search history retrieved successfully', searchHistory: user.searchHistory });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving search history', error: error.message });
    }
};
