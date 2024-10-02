// Import necessary modules
const LearningModule = require('../models/LearningModule');
const User = require('../models/User');
const mongoose = require('mongoose');
const { generateContentWithAI } = require('../utils/aiUtils'); // Import the AI content generation function

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
            estimatedTime,
            targetAudience,
            creator: req.user.id,
            createdAt: new Date(),
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
    if (creatorId) query.creator = creatorId;

    try {
        const totalModules = await LearningModule.countDocuments(query);
        const learningModules = await LearningModule.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

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

        if (learningModule.creator.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this learning module' });
        }

        learningModule.title = title;
        learningModule.description = description;
        learningModule.subject = subject;
        learningModule.grade = grade;
        learningModule.activities = activities;
        learningModule.prerequisites = prerequisites;
        learningModule.estimatedTime = estimatedTime;
        learningModule.targetAudience = targetAudience;
        learningModule.updatedAt = new Date();

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
        const regex = new RegExp(keyword, 'i');
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


// Enroll a student in a learning module
const enrollStudentInModule = async (req, res) => {
    const { userId, moduleId } = req.body;

    try {
        // Find the user and module
        const user = await User.findById(userId);
        const module = await LearningModule.findById(moduleId);

        if (!user || !module) {
            return res.status(404).json({ message: 'User or Module not found' });
        }

        // Enroll user in the module (assuming there's an enrolledModules array in the User model)
        if (!user.enrolledModules.includes(moduleId)) {
            user.enrolledModules.push(moduleId);
            await user.save();
        }

        // Fetch the module content
        const moduleContent = module.content; // Adjust according to your model's content structure

        // Get the user's level (for example, elementary, secondary, university)
        const userLevel = user.level; // Ensure your User model has a 'level' field
        
        // Use AI to adjust the module content based on the user's level
        const adjustedContent = await generateContentWithAI(moduleContent, userLevel);

        // Send the adjusted content back in the response
        res.status(200).json({
            message: 'Student enrolled successfully',
            content: adjustedContent,
        });
    } catch (error) {
        console.error('Error enrolling student in module:', error);
        res.status(500).json({ message: 'Error enrolling student', error: error.message });
    }
};

// Get enrolled students in a learning module
exports.getEnrolledStudents = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId).select('enrolledStudents');
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        const students = await User.find({ _id: { $in: learningModule.enrolledStudents } });
        res.status(200).json({ enrolledStudents: students });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving enrolled students', error: error.message });
    }
};

// Mark a learning module as completed for a user
exports.completeLearningModule = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        if (!learningModule.completedUsers.includes(req.user.id)) {
            learningModule.completedUsers.push(req.user.id);
            await learningModule.save();
            res.status(200).json({ message: 'Learning module marked as completed', learningModule });
        } else {
            res.status(400).json({ message: 'Module already marked as completed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error marking module as completed', error: error.message });
    }
};

// Add an assessment to a learning module
exports.addAssessment = async (req, res) => {
    const { moduleId } = req.params;
    const { assessment } = req.body; // Expecting assessment details in the body

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        learningModule.assessments.push(assessment);
        await learningModule.save();
        res.status(200).json({ message: 'Assessment added successfully', learningModule });
    } catch (error) {
        res.status(500).json({ message: 'Error adding assessment', error: error.message });
    }
};

// Get feedback for a specific learning module
exports.getFeedback = async (req, res) => {
    const { moduleId } = req.params;

    try {
        const learningModule = await LearningModule.findById(moduleId).select('feedback');
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        res.status(200).json({ feedback: learningModule.feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

// Add feedback for a learning module
exports.addFeedback = async (req, res) => {
    const { moduleId } = req.params;
    const { feedback } = req.body; // Expecting feedback content in the body

    try {
        const learningModule = await LearningModule.findById(moduleId);
        if (!learningModule) return res.status(404).json({ message: 'Learning module not found' });

        learningModule.feedback.push({ userId: req.user.id, feedback, createdAt: new Date() });
        await learningModule.save();
        res.status(200).json({ message: 'Feedback added successfully', learningModule });
    } catch (error) {
        res.status(500).json({ message: 'Error adding feedback', error: error.message });
    }
};

// Export the methods
module.exports = {
    enrollStudentInModule,
    getEnrolledStudents,
    completeLearningModule,
    addAssessment,
    getFeedback,
    addFeedback,
};
