const express = require('express');
const { 
    collectFeedback,
    getLectureFeedback,
    getFeedbackSummary,
    deleteFeedback 
} = require('../controllers/lectureFeedbackController');
const router = express.Router();

// Route for collecting feedback
router.post('/feedback', collectFeedback);

// Route for getting feedback for a specific lecture
router.get('/feedback/:lectureId', getLectureFeedback);

// Route for getting feedback summary for a specific lecture
router.get('/feedback/summary/:lectureId', getFeedbackSummary);

// Route for deleting feedback
router.delete('/feedback/:feedbackId', deleteFeedback);

module.exports = router;

