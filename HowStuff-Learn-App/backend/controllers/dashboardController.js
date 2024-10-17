const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Gamification = require('../models/Gamification');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const LearningPathController = require('./learningPathController');

const getUserActivityFeed = async (userId) => {
    return await Activity.find({ userId }).sort({ createdAt: -1 }).limit(5);
};

const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5);
};

const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('Fetching upcomingLectures with userId:', userId);
        const upcomingLectures = await Lecture.find({
            attendees: userId,
            scheduledTime: { $gte: new Date() }, // Ensure this matches future dates correctly
            $or: [{ isAR: true }, { isVR: true }]
        }).sort({ scheduledTime: 1 }).limit(5);
        console.log('upcomingLectures:', JSON.stringify(upcomingLectures));

        console.log('Fetching recentQuizzes with userId:', userId);
        const recentQuizzes = await Quiz.find({
            participants: userId, // Ensure this field matches correctly
            isARVRQuiz: true
        }).sort({ createdAt: -1 }).limit(5);
        console.log('recentQuizzes:', JSON.stringify(recentQuizzes));

        console.log('Fetching user progress for userId:', userId);
        const user = await User.findById(userId).populate('progress.assessmentId');
        console.log('userProgress:', JSON.stringify(user.progress));

        console.log('Fetching suggestedResources for learningPreferences:', user.preferences?.learningPreferences);
        if (!Array.isArray(user.preferences?.learningPreferences)) {
            user.preferences.learningPreferences = [];
        }
        const suggestedResources = await Resource.find({
            subjects: { $in: user.preferences.learningPreferences },
            $or: [{ isAR: true }, { isVR: true }]
        }).limit(5);
        console.log('suggestedResources:', JSON.stringify(suggestedResources));

        console.log('Fetching gamificationStatus for userId:', userId);
        const gamificationStatus = await Gamification.findOne({ userId });
        console.log('gamificationStatus:', JSON.stringify(gamificationStatus));

        console.log('Fetching activityFeed for userId:', userId);
        const activityFeed = await getUserActivityFeed(userId);
        console.log('activityFeed:', JSON.stringify(activityFeed));

        console.log('Fetching notifications for userId:', userId);
        const notifications = await getUserNotifications(userId);
        console.log('notifications:', JSON.stringify(notifications));

        console.log('Fetching learningPaths for userId:', userId);
        const learningPaths = await LearningPathController.getUserLearningPaths(userId);
        console.log('learningPaths:', JSON.stringify(learningPaths));

        res.status(200).json({
            upcomingLectures,
            recentQuizzes,
            progress: Array.isArray(user.progress) ? user.progress : [], // Ensure progress is an array
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
