const User = require('../models/User');
const Badge = require('../models/Badge');
const Reward = require('../models/Reward');
const Leaderboard = require('../models/Leaderboard');

// Add a badge to the user account
exports.addBadge = async (req, res) => {
    try {
        const { userId, badgeId } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the badge exists
        const badge = await Badge.findById(badgeId);
        if (!badge) {
            return res.status(404).json({ message: 'Badge not found.' });
        }

        // Add badge to user
        user.badges.push(badgeId);
        await user.save();

        res.status(200).json({ message: 'Badge added successfully.', badge });
    } catch (error) {
        res.status(500).json({ message: 'Error adding badge.', error });
    }
};

// Grant rewards to users
exports.grantReward = async (req, res) => {
    try {
        const { userId, rewardId } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the reward exists
        const reward = await Reward.findById(rewardId);
        if (!reward) {
            return res.status(404).json({ message: 'Reward not found.' });
        }

        // Grant reward to user
        user.rewards.push(rewardId);
        await user.save();

        res.status(200).json({ message: 'Reward granted successfully.', reward });
    } catch (error) {
        res.status(500).json({ message: 'Error granting reward.', error });
    }
};

// Get leaderboard rankings
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Leaderboard.find().sort({ points: -1 }).limit(10).populate('userId');

        if (!leaderboard.length) {
            return res.status(404).json({ message: 'No leaderboard data available.' });
        }

        res.status(200).json({ message: 'Leaderboard retrieved successfully.', leaderboard });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving leaderboard.', error });
    }
};

// Track user points for leaderboard ranking
exports.updateUserPoints = async (req, res) => {
    try {
        const { userId, points } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user points
        user.points += points;
        await user.save();

        res.status(200).json({ message: 'User points updated successfully.', points: user.points });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user points.', error });
    }
};
