const Feedback = require('../models/Feedback');
const Lecture = require('../models/Lecture');
const User = require('../models/User');
const notificationService = require('../utils/notificationService'); // For sending notifications

// Collect feedback for a lecture
exports.collectFeedback = async (req, res) => {
    try {
        const { userId, lectureId, feedbackDetails } = req.body;

        // Check if user has already submitted feedback for the lecture
        const existingFeedback = await Feedback.findOne({ userId, lectureId });
        if (existingFeedback) {
            return res.status(400).json({ message: 'Feedback already submitted for this lecture' });
        }

        // Create feedback entry in the database
        const feedback = await Feedback.create({
            userId,
            lectureId,
            rating: feedbackDetails.rating,
            comments: feedbackDetails.comments,
        });

        // Update lecture with new feedback
        await Lecture.findByIdAndUpdate(lectureId, { $inc: { feedbackCount: 1 } });

        // Notify the user about successful feedback submission
        const user = await User.findById(userId);
        await notificationService.sendFeedbackNotification(user.email, feedback);

        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Feedback submission failed', error });
    }
};

// Get feedback for a specific lecture
exports.getLectureFeedback = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const feedback = await Feedback.find({ lectureId }).populate('userId', 'name email');

        res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve feedback', error });
    }
};

// Get summary of feedback for a specific lecture
exports.getFeedbackSummary = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const feedback = await Feedback.find({ lectureId });

        const totalFeedback = feedback.length;
        const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback || 0;

        res.status(200).json({
            totalFeedback,
            averageRating,
            feedback,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve feedback summary', error });
    }
};

// Update feedback (optional)
exports.updateFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { rating, comments } = req.body;

        // Find and update the feedback record
        const feedback = await Feedback.findByIdAndUpdate(feedbackId, { rating, comments }, { new: true });
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ message: 'Feedback updated successfully', feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update feedback', error });
    }
};

// Delete feedback (optional)
exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        // Find and delete the feedback record
        const feedback = await Feedback.findByIdAndDelete(feedbackId);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Optionally update lecture feedback count
        await Lecture.findByIdAndUpdate(feedback.lectureId, { $inc: { feedbackCount: -1 } });

        res.status(200).json({ message: 'Feedback deleted successfully', feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete feedback', error });
    }
};
