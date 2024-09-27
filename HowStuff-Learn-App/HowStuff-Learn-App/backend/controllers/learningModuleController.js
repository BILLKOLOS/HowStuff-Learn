// Import necessary modules
const LearningModule = require('../models/LearningModule');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new learning module
exports.createLearningModule = async (req, res) => {
    const { title, description, subject, grade, activities, prerequisites, estimatedTime, targetAudience } = req.body;

    try {
        const newLearningModule = new LearningModule({
            title,
            description,
            subject,
            grade,
            activities,
            prerequisites,
            estimatedTime,  // New field to estimate time needed for the module
            targetAudience,  // New field to specify the intended audience
            creator: req.user.id,
            createdAt: new Date(),  // Track creation date
        });

        await newLearningModule.save();
        res.status(201).json({ message: 'Learning module created successfully', learningModule: newLearningModule });
    } catch (error) {
        res.status(500).json({ message: 'Error creating learning module', error: error.message });
    }
};

// Get all learning modules with optional filtering and pagination
exports.getLearningModules = async (req, res) => {
    const { subject, grade, creatorId, page = 1, limit = 10 } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (creatorId) query.creator = creatorId; // Filter by creator ID

    try {
        const totalModules = await LearningModule.countDocuments(query);
        const learningModules = await LearningModule.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });  // Sort by creation date descending

        res.status(200).json({
            totalModules,
            totalPages: Math.ceil(totalModules / limit),
            currentPage: Number(page),
            learningModules,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving learning modules', error: error.message });
    }
};

// Update an existing learning module
exports.updateLearningModule = async (req, res) => {
    const { moduleId } = req.params;
    const { title, description, subject, grade, activities, prerequisites, estimatedTime, targetAudience } = req.body;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        // Update only if the creator matches
        if (learningModule.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this learning module' });
        }

        learningModule.title = title;
        learningModule.description = description;
        learningModule.subject = subject;
        learningModule.grade = grade;
        learningModule.activities = activities;
        learningModule.prerequisites = prerequisites;
        learningModule.estimatedTime = estimatedTime;  // Update estimated time
        learningModule.targetAudience = targetAudience;  // Update target audience
        learningModule.updatedAt = new Date();  // Track last updated date

        await learningModule.save();
        res.status(200).json({ message: 'Learning module updated successfully', learningModule });
    } catch (error) {
        res.status(500).json({ message: 'Error updating learning module', error: error.message });
    }
};

// Delete a learning module
exports.deleteLearningModule = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        // Check if the user is the creator before deletion
        if (learningModule.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to delete this learning module' });
        }

        await LearningModule.findByIdAndDelete(moduleId);
        res.status(200).json({ message: 'Learning module deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting learning module', error: error.message });
    }
};

// Get specific activities in a learning module
exports.getActivities = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        res.status(200).json({ activities: learningModule.activities });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving activities', error: error.message });
    }
};

// Get prerequisites for a specific learning module
exports.getPrerequisites = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        res.status(200).json({ prerequisites: learningModule.prerequisites });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving prerequisites', error: error.message });
    }
};

// Search learning modules by keyword
exports.searchLearningModules = async (req, res) => {
    const { keyword, page = 1, limit = 10 } = req.query;

    try {
        const regex = new RegExp(keyword, 'i'); // Case insensitive regex
        const totalModules = await LearningModule.countDocuments({ title: regex });
        const learningModules = await LearningModule.find({ title: regex })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            totalModules,
            totalPages: Math.ceil(totalModules / limit),
            currentPage: Number(page),
            learningModules,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching learning modules', error: error.message });
    }
};

// Get user-specific learning modules
exports.getUserLearningModules = async (req, res) => {
    const { userId } = req.params;

    try {
        const learningModules = await LearningModule.find({ creator: userId });
        res.status(200).json({ learningModules });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user learning modules', error: error.message });
    }
};

// Rate a learning module
exports.rateLearningModule = async (req, res) => {
    const { moduleId } = req.params;
    const { rating } = req.body;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        learningModule.ratings.push({ userId: req.user.id, rating });
        await learningModule.save();
        res.status(200).json({ message: 'Learning module rated successfully', learningModule });
    } catch (error) {
        res.status(500).json({ message: 'Error rating learning module', error: error.message });
    }
};

// Get average rating for a learning module
exports.getAverageRating = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        const totalRating = learningModule.ratings.reduce((sum, { rating }) => sum + rating, 0);
        const averageRating = totalRating / learningModule.ratings.length || 0;

        res.status(200).json({ averageRating });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating average rating', error: error.message });
    }
};

// Add comment to a learning module
exports.addComment = async (req, res) => {
    const { moduleId } = req.params;
    const { comment } = req.body;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        learningModule.comments.push({ userId: req.user.id, comment, createdAt: new Date() });
        await learningModule.save();
        res.status(200).json({ message: 'Comment added successfully', learningModule });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

// Get comments for a learning module
exports.getComments = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId).select('comments');
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        res.status(200).json({ comments: learningModule.comments });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
};

