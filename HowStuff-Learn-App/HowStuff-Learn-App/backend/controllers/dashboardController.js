// dashboardController.js
const Lecture = require('../models/lectureModel');
const Quiz = require('../models/quizModel');
const User = require('../models/userModel');
const Resource = require('../models/resourceModel');
const Gamification = require('../models/gamificationModel'); // For badges and rewards

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

        // Send the collected data to the client
        res.status(200).json({
            upcomingLectures,
            recentQuizzes,
            progress: user.progress,
            suggestedResources,
            gamificationStatus
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to load dashboard data' });
    }
};
