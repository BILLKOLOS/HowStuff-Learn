const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

// Update progress
router.post('/update', progressController.updateProgress);

// Get progress report
router.get('/:userId/report', progressController.getProgressReport);

// Set learning goals
router.post('/goals', progressController.setLearningGoals);

// Get detailed progress report
router.get('/:userId/detailed-report', progressController.getDetailedProgressReport);

// Analyze user behavior
router.get('/:userId/analyze-behavior', progressController.analyzeUserBehavior);

// Get historical progress trends
router.get('/:userId/historical-trends', progressController.getHistoricalProgressTrends);

module.exports = router;

