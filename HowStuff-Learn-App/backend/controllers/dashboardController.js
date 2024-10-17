const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Gamification = require('../models/Gamification');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const LearningPathController = require('./learningPathController');

// Fetch user activity for the activity feed
const getUserActivityFeed = async (userId) => {
    return await Activity.find({ userId }).sort({ createdAt: -1 }).limit(5); // Fetch last 5 activities
};

// Fetch user notifications
const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5); // Fetch last 5 notifications
};

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('Fetching upcomingLectures');
        const upcomingLectures = await Lecture.find({
            attendees: userId,
            startTime: { $gte: new Date() },
            $or: [{ isAR: true }, { isVR: true }]
        }).sort({ startTime: 1 }).limit(5);

        console.log('Fetching recentQuizzes');
        const recentQuizzes = await Quiz.find({
            participants: userId,
            isARVRQuiz: true
        }).sort({ createdAt: -1 }).limit(5);

        console.log('Fetching user progress');
        const user = await User.findById(userId).populate('progress.assessmentId');

        console.log('Fetching suggestedResources');
        if (!Array.isArray(user.preferences?.learningPreferences)) {
            user.preferences.learningPreferences = []; // Ensure it's an array
        }
        const suggestedResources = await Resource.find({
            subjects: { $in: user.preferences.learningPreferences },
            $or: [{ isAR: true }, { isVR: true }]
        }).limit(5);

        console.log('Fetching gamificationStatus');
        const gamificationStatus = await Gamification.findOne({ userId });

        console.log('Fetching activityFeed');
        const activityFeed = await getUserActivityFeed(userId);

        console.log('Fetching notifications');
        const notifications = await getUserNotifications(userId);

        console.log('Fetching learningPaths');
        const learningPaths = await LearningPathController.getUserLearningPaths(userId);

        res.status(200).json({
            upcomingLectures,
            recentQuizzes,
            progress: user.progress,
            suggestedResources,
            gamificationStatus,
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

module.exports = { getDashboard };

