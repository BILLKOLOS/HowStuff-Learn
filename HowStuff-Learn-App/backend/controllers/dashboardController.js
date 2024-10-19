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

        // First, fetch the user data
        const user = await User.findById(userId).populate('progress.assessmentId');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Now that we have the user, proceed to fetch other data concurrently
        const [
            upcomingLectures,
            recentQuizzes,
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

            // Now we can safely use `user.preferences`
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

// Function to get the parent dashboard
const getParentDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetching parent's children
        const parentUser = await User.findById(userId).populate('children'); // Assuming 'children' is an array of child user IDs

        if (!parentUser) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        // Fetch notifications and recent activities for the parent
        const notifications = await getUserNotifications(userId);
        const recentActivities = await getUserActivityFeed(userId);

        // Fetch details for each child
        const childrenDetails = await Promise.all(parentUser.children.map(async (childId) => {
            const child = await User.findById(childId).populate('progress.assessmentId'); // Assuming 'progress' has the assessments
            return {
                _id: child._id,
                name: child.name,
                grade: child.grade,
                progress: child.progress || [],
                learningGoals: child.learningGoals || [],
                recentActivities: await getUserActivityFeed(childId) // Assuming you want the child's activity feed
            };
        }));

        // Fetch upcoming events (if applicable)
        const upcomingEvents = await Lecture.find({
            attendees: { $in: parentUser.children }, // Check events for all children
            scheduledTime: { $gte: new Date() }
        }).sort({ scheduledTime: 1 }).limit(5);

        // Sending response with parent dashboard data
        res.status(200).json({
            children: childrenDetails,
            notifications,
            recentActivities,
            upcomingEvents
        });
    } catch (err) {
        console.error("Error fetching parent dashboard data:", err);
        res.status(500).json({ message: 'Failed to load parent dashboard data', error: err.message });
    }
};

// Exporting the functions
module.exports = {
    getDashboard,
    getParentDashboard
};
