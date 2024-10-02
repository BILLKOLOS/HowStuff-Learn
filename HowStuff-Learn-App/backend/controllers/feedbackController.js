const Feedback = require('../models/Feedback');
const User = require('../models/User');
const { generateContentWithAI, USER_LEVELS } = require('../utils/aiUtils'); // Import AI utility functions

// Submit feedback for a user submission or progress
exports.submitFeedback = async (req, res) => {
    const { userId, submissionId, feedback } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate tailored feedback using AI based on user's level
        const tailoredFeedback = await generateContentWithAI(feedback, user.level); // Pass user level

        const newFeedback = new Feedback({
            userId,
            submissionId,
            feedback: tailoredFeedback,
            createdAt: new Date(),
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: tailoredFeedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback', details: error.message });
    }
};

// Get all feedback for a user
exports.getUserFeedback = async (req, res) => {
    const { userId } = req.params;

    try {
        const feedbacks = await Feedback.find({ userId }).populate('submissionId'); // Populate to get submission details
        res.status(200).json({ message: 'Feedback retrieved successfully', data: feedbacks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve feedback', details: error.message });
    }
};

// Get detailed feedback on a specific submission
exports.getSubmissionFeedback = async (req, res) => {
    const { submissionId } = req.params;

    try {
        const feedback = await Feedback.findOne({ submissionId });
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback retrieved successfully', data: feedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve feedback', details: error.message });
    }
};

// Update feedback for a user submission
exports.updateFeedback = async (req, res) => {
    const { submissionId, feedback } = req.body;

    try {
        const existingFeedback = await Feedback.findOne({ submissionId });
        if (!existingFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        // Generate new tailored feedback using AI
        const tailoredFeedback = await generateContentWithAI(feedback, existingFeedback.userId.level); // Get user level from existing feedback

        existingFeedback.feedback = tailoredFeedback;
        await existingFeedback.save();
        res.status(200).json({ message: 'Feedback updated successfully', feedback: tailoredFeedback });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update feedback', details: error.message });
    }
};

// Delete feedback for a user submission
exports.deleteFeedback = async (req, res) => {
    const { submissionId } = req.params;

    try {
        const result = await Feedback.deleteOne({ submissionId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete feedback', details: error.message });
    }
};

// Analyze feedback trends for a user
exports.analyzeFeedbackTrends = async (req, res) => {
    const { userId } = req.params;

    try {
        const feedbackData = await Feedback.find({ userId });
        const positiveFeedbackCount = feedbackData.filter(f => f.feedback.includes('good') || f.feedback.includes('excellent')).length;
        const negativeFeedbackCount = feedbackData.filter(f => f.feedback.includes('poor') || f.feedback.includes('bad')).length;

        const trendsAnalysis = {
            totalFeedback: feedbackData.length,
            positiveFeedback: positiveFeedbackCount,
            negativeFeedback: negativeFeedbackCount,
        };

        res.status(200).json({ message: 'Feedback trends analyzed successfully', data: trendsAnalysis });
    } catch (error) {
        res.status(500).json({ error: 'Failed to analyze feedback trends', details: error.message });
    }
};
