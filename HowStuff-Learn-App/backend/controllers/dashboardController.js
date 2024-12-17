const Lecture = require('../models/Lecture'); 
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Gamification = require('../models/Gamification');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const LearningPathController = require('./learningPathController');
const ProgressController = require('./ProgressController'); // Assuming a progress tracker exists

// Function to fetch user activity feed
const getUserActivityFeed = async (userId) => {
    return await Activity.find({ userId }).sort({ createdAt: -1 }).limit(5);
};

// Function to fetch user notifications
const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(5);
};

// Main student dashboard
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user data and preferences
        const user = await User.findById(userId).populate('progress.assessmentId');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Concurrently fetch data for the dashboard
        const [
            upcomingLectures,
            recentQuizzes,
            suggestedResources,
            gamificationStatus,
            activityFeed,
            notifications,
            learningPaths,
            progressOverview
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

            Resource.find({
                subjects: { $in: user.preferences?.learningPreferences || [] },
                $or: [{ isAR: true }, { isVR: true }]
            }).limit(5),

            Gamification.findOne({ userId }),
            getUserActivityFeed(userId),
            getUserNotifications(userId),
            LearningPathController.getUserLearningPaths(userId),
            ProgressController.getProgressOverview(userId) // Custom function for summarized progress
        ]);

        // Format response
        res.status(200).json({
            userInfo: {
                name: user.name,
                grade: user.grade,
                learningGoals: user.learningGoals || [],
                preferences: user.preferences || {}
            },
            upcomingLectures,
            recentQuizzes,
            suggestedResources,
            gamificationStatus: gamificationStatus || {},
            activityFeed,
            notifications,
            learningPaths,
            progressOverview,
            arvrModules: { upcomingLectures, recentQuizzes, suggestedResources }
        });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        res.status(500).json({ message: 'Failed to load dashboard data', error: err.message });
    }
};

// Parent dashboard
const getParentDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch parent user and their children
        const parentUser = await User.findById(userId).populate('children'); 
        if (!parentUser) return res.status(404).json({ message: 'Parent not found' });

        const [notifications, recentActivities] = await Promise.all([
            getUserNotifications(userId),
            getUserActivityFeed(userId)
        ]);

        // Fetch children's data
        const childrenDetails = await Promise.all(parentUser.children.map(async (childId) => {
            const child = await User.findById(childId).populate('progress.assessmentId');
            if (!child) return null;

            const childActivity = await getUserActivityFeed(childId);
            return {
                _id: child._id,
                name: child.name,
                grade: child.grade,
                progress: child.progress || [],
                learningGoals: child.learningGoals || [],
                recentActivities: childActivity
            };
        }));

        // Filter null entries
        const validChildrenDetails = childrenDetails.filter(child => child !== null);

        // Fetch upcoming events for children
        const upcomingEvents = await Lecture.find({
            attendees: { $in: parentUser.children },
            scheduledTime: { $gte: new Date() }
        }).sort({ scheduledTime: 1 }).limit(5);

        res.status(200).json({
            parentInfo: {
                name: parentUser.name,
                childrenCount: parentUser.children.length
            },
            children: validChildrenDetails,
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
