const Lecture = require('../models/Lecture'); // Updated model name
const Quiz = require('../models/Quiz'); // Updated model name
const User = require('../models/User'); // Updated model name
const Resource = require('../models/Resource'); // Updated model name
const Gamification = require('../models/Gamification'); // Updated model name
const Activity = require('../models/Activity'); // For user activity feed
const Notification = require('../models/Notification'); // For notifications (if implemented)

// Fetch user activity for the activity feed
const getUserActivityFeed = async (userId) => {
    return await Activity.find({ userId }).sort({ createdAt: -1 }).limit(5); // Adjust the model and limit as needed
};

// Fetch user notifications
const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5); // Fetch the last 5 notifications
};

// Controller to get the dashboard data
exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch upcoming and live lectures
        const upcomingLectures = await Lecture.find({
            attendees: userId,
            startTime: { $gte: new Date() } // Find lectures starting in the future
        }).sort({ startTime: 1 }).limit(5); // Get the next 5 upcoming lectures

        // Fetch recent quizzes and assignments
        const recentQuizzes = await Quiz.find({
            participants: userId
        }).sort({ createdAt: -1 }).limit(5); // Get the last 5 quizzes or assignments

        // Fetch user progress for courses
        const user = await User.findById(userId).populate('progress.assessmentId');

        // Fetch suggested resources based on user activity or preferences
        const suggestedResources = await Resource.find({
            subjects: { $in: user.learningPreferences } // Match resources to user preferences
        }).limit(5); // Fetch 5 suggested resources

        // Fetch gamification status (badges earned)
        const gamificationStatus = await Gamification.findOne({ userId });

        // Fetch user activity feed
        const activityFeed = await getUserActivityFeed(userId);

        // Fetch user notifications
        const notifications = await getUserNotifications(userId);

        // Send the collected data to the client
        res.status(200).json({
            upcomingLectures,
            recentQuizzes,
            progress: user.progress,
            suggestedResources,
            gamificationStatus,
            activityFeed,
            notifications,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to load dashboard data', error: err.message });
    }
};
