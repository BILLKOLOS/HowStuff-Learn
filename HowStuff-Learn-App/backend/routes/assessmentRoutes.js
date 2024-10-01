const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Create assessment
router.post('/assessments', authMiddleware, assessmentController.createAssessment);

// Take assessment
router.post('/assessments/:assessmentId/take', authMiddleware, assessmentController.takeAssessment);

module.exports = router;
