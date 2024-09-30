// learningPathController.js
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');
const Assessment = require('../models/Assessment'); // To track assessments related to learning paths
const RecommendationService = require('../services/RecommendationService'); // For AI-based recommendations
const { validateLearningPath } = require('../validators/learningPathValidator'); // Input validation

// Create a new learning path
exports.createLearningPath = async (req, res) => {
    const { userId, title, description, modules } = req.body;

    // Validate input data
    const { error } = validateLearningPath(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const learningPath = new LearningPath({
            userId,
            title,
            description,
            modules,
        });
        await learningPath.save();
        res.status(201).json({ message: 'Learning path created successfully', learningPath });
    } catch (err) {
        res.status(500).json({ message: 'Error creating learning path', error: err.message });
    }
};

// Get all learning paths for a user
exports.getUserLearningPaths = async (req, res) => {
    const userId = req.user.id;

    try {
        const learningPaths = await LearningPath.find({ userId });
        res.status(200).json(learningPaths);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching learning paths', error: err.message });
    }
};

// Update a learning path
exports.updateLearningPath = async (req, res) => {
    const { pathId } = req.params;
    const updates = req.body;

    // Validate input data
    const { error } = validateLearningPath(updates);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const updatedLearningPath = await LearningPath.findByIdAndUpdate(pathId, updates, { new: true });
        if (!updatedLearningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }
        res.status(200).json({ message: 'Learning path updated successfully', updatedLearningPath });
    } catch (err) {
        res.status(500).json({ message: 'Error updating learning path', error: err.message });
    }
};

// Delete a learning path
exports.deleteLearningPath = async (req, res) => {
    const { pathId } = req.params;

    try {
        const deletedLearningPath = await LearningPath.findByIdAndDelete(pathId);
        if (!deletedLearningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }
        res.status(200).json({ message: 'Learning path deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting learning path', error: err.message });
    }
};

// Get a specific learning path
exports.getLearningPathById = async (req, res) => {
    const { pathId } = req.params;

    try {
        const learningPath = await LearningPath.findById(pathId);
        if (!learningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }
        res.status(200).json(learningPath);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching learning path', error: err.message });
    }
};

// Generate AI-based learning path recommendations
exports.getAIRecommendations = async (req, res) => {
    const userId = req.user.id;

    try {
        const recommendations = await RecommendationService.getRecommendations(userId);
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: 'Error generating recommendations', error: err.message });
    }
};

// Track user progress in a learning path
exports.trackUserProgress = async (req, res) => {
    const { pathId, assessmentId } = req.body;
    const userId = req.user.id;

    try {
        // Update user's progress
        const learningPath = await LearningPath.findById(pathId);
        if (!learningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }

        // Assuming `progress` is an array of assessment IDs in the user model
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.progress.includes(assessmentId)) {
            user.progress.push(assessmentId);
            await user.save();
        }

        // Update assessment status (if applicable)
        await Assessment.findByIdAndUpdate(assessmentId, { status: 'completed' });

        res.status(200).json({ message: 'User progress tracked successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error tracking progress', error: err.message });
    }
};
