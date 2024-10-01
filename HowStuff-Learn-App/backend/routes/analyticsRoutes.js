const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/AnalyticsController');
const { authenticate } = require('../middlewares/authMiddleware'); // Assuming you have an authentication middleware

// Track user engagement metrics
router.post('/engagement', authenticate, AnalyticsController.trackUserEngagement);

// Generate analytics reports for educators
router.get('/reports', authenticate, AnalyticsController.generateAnalyticsReports);

// Get detailed engagement metrics for a user
router.get('/user/:id/metrics', authenticate, AnalyticsController.getUserEngagementMetrics);

// Export analytics data as CSV
router.post('/export', authenticate, AnalyticsController.exportAnalyticsData);

// Generate customized user reports
router.post('/custom-report', authenticate, AnalyticsController.generateCustomizedReports);

// Integration with external analytics tools
router.post('/integrate', authenticate, AnalyticsController.integrateWithExternalAnalytics);

module.exports = router;

