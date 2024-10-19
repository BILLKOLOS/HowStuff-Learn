const Lecture = require('../models/Lecture'); 
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Gamification = require('../models/Gamification');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const LearningPathController = require('./learningPathController');

// Function to get user activity feed
const getUserActivityFeed = async (userId) => {
    return await Activity.find({ userId }).sort({ createdAt: -1 }).limit(5);
};

// Function to get user notifications
const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5);
};

// Function to get the main dashboard
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch multiple data points concurrently
        const [
            upcomingLectures,
            recentQuizzes,
            user,
            suggestedResources,
            gamificationStatus,
            activityFeed,
            notifications,
            learningPaths,
        ] = await Promise.all([
            Lecture.find({
                attendees: userId,
                scheduledTime: { $gte: new Date() },
                $or: [{ isAR: true }, { isVR: true }]
            }).sort({ scheduledTime: 1 }).limit(5),

            Quiz.find({
                participants: userId,
                isARVRQuiz: true
            }).sort({ createdAt: -1 }).limit(5),

            User.findById(userId).populate('progress.assessmentId'),

            Resource.find({
                subjects: { $in: user.preferences?.learningPreferences || [] },
                $or: [{ isAR: true }, { isVR: true }]
            }).limit(5),

            Gamification.findOne({ userId }),
            getUserActivityFeed(userId),
            getUserNotifications(userId),
            LearningPathController.getUserLearningPaths(userId)
        ]);

        res.status(200).json({
            upcomingLectures,
            recentQuizzes,
            progress: Array.isArray(user.progress) ? user.progress : [],
            suggestedResources,
            gamificationStatus: gamificationStatus || {},
            activityFeed,
            notifications,
            learningPaths,
            arvrModules: { upcomingLectures, recentQuizzes, suggestedResources }
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: 'Failed to load dashboard data', error: err.message });
    }
};

// Placeholder for the parent dashboard function
const getParentDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        // Your logic for fetching the parent dashboard data here
        res.status(200).json({ message: 'Parent dashboard data fetched successfully' });
    } catch (err) {
        console.error("Error fetching parent dashboard data:", err);
        res.status(500).json({ message: 'Failed to load parent dashboard data', error: err.message });
    }
};

// Exporting the functions
module.exports = {
    getDashboard,
    getParentDashboard // Ensure this is included
};
