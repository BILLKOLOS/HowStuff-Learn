// controllers/learningPathController.js

const LearningPath = require('../models/LearningPath');
const User = require('../models/User');
const Assessment = require('../models/Assessment'); // To track assessments related to learning paths
const Progress = require('../models/Progress'); // Assuming you have a Progress model
const aiUtils = require('../utils/aiUtils'); // Updated to use aiUtils
const { validateLearningPath } = require('../validators/learningPathValidator'); // Input validation

// Define createLearningPath function
const createLearningPath = async (req, res) => {
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

// Define getUserLearningPaths function (internal)
const getUserLearningPaths = async (userId) => {
    try {
        const learningPaths = await LearningPath.find({ userId });
        return learningPaths;
    } catch (err) {
        throw new Error('Error fetching learning paths');
    }
};

// Define getUserLearningPathsEndpoint function (API endpoint)
const getUserLearningPathsEndpoint = async (req, res) => {
    const userId = req.user.id;

    try {
        const learningPaths = await getUserLearningPaths(userId);
        res.status(200).json(learningPaths);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching learning paths', error: err.message });
    }
};

// Define updateLearningPath function
const updateLearningPath = async (req, res) => {
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

// Define deleteLearningPath function
const deleteLearningPath = async (req, res) => {
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

// Define getLearningPathById function
const getLearningPathById = async (req, res) => {
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

// Define getAIRecommendations function
const getAIRecommendations = async (req, res) => {
    const userId = req.user.id;

    try {
        const recommendations = await aiUtils.getRecommendations(userId);
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: 'Error generating recommendations', error: err.message });
    }
};

// Define trackUserProgress function
const trackUserProgress = async (req, res) => {
    const { pathId, assessmentId } = req.body;
    const userId = req.user.id;

    try {
        // Update user's progress
        const learningPath = await LearningPath.findById(pathId);
        if (!learningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }

        // Assuming progress is an array of assessment IDs in the user model
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

// Define getLearningPathProgress function
const getLearningPathProgress = async (req, res) => {
    const { pathId } = req.params;
    const userId = req.user.id;

    try {
        const learningPath = await LearningPath.findById(pathId);
        if (!learningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }

        // Assuming progress data is stored in a separate model or field
        const userProgress = await Progress.findOne({ userId, moduleId: pathId });
        res.status(200).json({ message: 'Progress retrieved successfully', userProgress });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving progress', error: err.message });
    }
};

// Define getModuleDetails function
const getModuleDetails = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const moduleDetails = await LearningPath.findOne({ 'modules._id': moduleId }, { 'modules.$': 1 });
        if (!moduleDetails) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.status(200).json(moduleDetails.modules[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving module details', error: err.message });
    }
};

// Define provideFeedback function
const provideFeedback = async (req, res) => {
    const { pathId, feedback } = req.body;
    const userId = req.user.id;

    try {
        const learningPath = await LearningPath.findById(pathId);
        if (!learningPath) {
            return res.status(404).json({ message: 'Learning path not found' });
        }

        // Assuming feedback is stored in an array in the LearningPath model
        learningPath.feedback.push({ user: userId, feedback, createdAt: new Date() });
        await learningPath.save();

        res.status(200).json({ message: 'Feedback submitted successfully', feedback });
    } catch (err) {
        res.status(500).json({ message: 'Error submitting feedback', error: err.message });
    }
};

// Define recommendLearningPaths function
const recommendLearningPaths = async (req, res) => {
    const userId = req.user.id;

    try {
        const recommendations = await aiUtils.getUserRecommendations(userId);
        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: 'Error generating recommendations', error: err.message });
    }
};

// Define getLearningPathHistory function
const getLearningPathHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const history = await LearningPath.find({ createdBy: userId }).select('-modules');
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving learning path history', error: err.message });
    }
};

// Export all functions
module.exports = {
    createLearningPath,
    getUserLearningPaths,
    getUserLearningPathsEndpoint,
    updateLearningPath,
    deleteLearningPath,
    getLearningPathById,
    getAIRecommendations,
    trackUserProgress,
    getLearningPathProgress,
    getModuleDetails,
    provideFeedback,
    recommendLearningPaths,
    getLearningPathHistory
};
