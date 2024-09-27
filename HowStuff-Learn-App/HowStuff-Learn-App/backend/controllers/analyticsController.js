const User = require('../models/User');
const LearningPath = require('../models/LearningPath');
const Assessment = require('../models/Assessment');
const Feedback = require('../models/Feedback');
const Engagement = require('../models/Engagement'); // Assuming there is an Engagement model

class AnalyticsController {
    // Track user engagement metrics
    async trackUserEngagement(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is available in req.user
            const { activityType, details, duration } = req.body;

            // Create a new engagement log
            const engagementLog = new Engagement({
                userId,
                activityType,
                details,
                duration,
                timestamp: new Date(),
            });
            await engagementLog.save();

            res.status(200).json({ message: 'Engagement tracked successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error tracking engagement.', error });
        }
    }

    // Generate analytics reports for educators
    async generateAnalyticsReports(req, res) {
        try {
            const reports = await Promise.all([
                this.getUserEngagementReport(),
                this.getAssessmentPerformanceReport(),
                this.getFeedbackAnalysisReport(),
                this.getTrendAnalysisReport(),
                this.getDropOffPointsReport(),
            ]);

            res.status(200).json({ reports });
        } catch (error) {
            res.status(500).json({ message: 'Error generating reports.', error });
        }
    }

    // Get user engagement report
    async getUserEngagementReport() {
        const users = await User.find({});
        const engagementReports = await Promise.all(users.map(async (user) => {
            const engagements = await Engagement.find({ userId: user._id });
            return {
                userId: user._id,
                totalEngagements: engagements.length,
                averageDuration: engagements.reduce((sum, e) => sum + e.duration, 0) / engagements.length || 0,
            };
        }));
        return engagementReports;
    }

    // Get assessment performance report
    async getAssessmentPerformanceReport() {
        const assessments = await Assessment.find({});
        const performanceReports = await Promise.all(assessments.map(async (assessment) => {
            const results = await assessment.getResults(); // Assuming this method exists in the Assessment model
            return {
                assessmentId: assessment._id,
                averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length || 0,
                completionRate: results.filter(r => r.completed).length / results.length || 0,
            };
        }));
        return performanceReports;
    }

    // Get feedback analysis report
    async getFeedbackAnalysisReport() {
        const feedbacks = await Feedback.find({});
        const feedbackSummary = feedbacks.reduce((acc, feedback) => {
            acc.totalFeedback += 1;
            acc.positiveFeedback += feedback.rating > 3 ? 1 : 0; // Assuming rating is out of 5
            return acc;
        }, { totalFeedback: 0, positiveFeedback: 0 });

        return {
            totalFeedback: feedbackSummary.totalFeedback,
            positiveFeedbackPercentage: (feedbackSummary.positiveFeedback / feedbackSummary.totalFeedback) * 100 || 0,
        };
    }

    // Get trend analysis report
    async getTrendAnalysisReport() {
        const engagementLogs = await Engagement.find({});
        const trends = {};

        engagementLogs.forEach(log => {
            const date = log.timestamp.toISOString().split('T')[0]; // Get date string
            trends[date] = (trends[date] || 0) + 1;
        });

        return trends;
    }

    // Identify drop-off points
    async getDropOffPointsReport() {
        const dropOffPoints = await Engagement.aggregate([
            { $group: { _id: "$activityType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 } // Top 5 drop-off points
        ]);
        return dropOffPoints;
    }

    // Get detailed engagement metrics for a user
    async getUserEngagementMetrics(req, res) {
        try {
            const userId = req.params.id;
            const engagements = await Engagement.find({ userId });
            const totalDuration = engagements.reduce((sum, e) => sum + e.duration, 0);
            const metrics = {
                totalEngagements: engagements.length,
                totalDuration,
                averageDuration: totalDuration / engagements.length || 0,
            };

            res.status(200).json({ metrics });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching engagement metrics.', error });
        }
    }

    // Export analytics data as CSV
    async exportAnalyticsData(req, res) {
        try {
            const analyticsData = await this.generateAnalyticsReports(req, res);
            // Implement CSV export logic here
            // e.g., using json2csv or similar library
            res.status(200).json({ message: 'Analytics data exported successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Error exporting analytics data.', error });
        }
    }

    // Generate customized user reports
    async generateCustomizedReports(req, res) {
        const { userId } = req.body;
        try {
            const userMetrics = await this.getUserEngagementMetrics({ params: { id: userId } });
            res.status(200).json({ metrics: userMetrics });
        } catch (error) {
            res.status(500).json({ message: 'Error generating customized reports.', error });
        }
    }

    // Integration with external analytics tools
    async integrateWithExternalAnalytics(req, res) {
        // Logic to send analytics data to external tools
        const { toolName, data } = req.body;

        // Example integration (pseudo-code):
        if (toolName === 'GoogleAnalytics') {
            // Send data to Google Analytics API
        } else if (toolName === 'Mixpanel') {
            // Send data to Mixpanel API
        }

        res.status(200).json({ message: 'Analytics data sent to external tools.' });
    }
}

module.exports = new AnalyticsController();

