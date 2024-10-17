const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Route to submit feedback
router.post('/submit', feedbackController.submitFeedback);

// Route to get all feedback for a user
router.get('/user/:userId', feedbackController.getUserFeedback);

// Route to get detailed feedback on a specific submission
router.get('/submission/:submissionId', feedbackController.getSubmissionFeedback);

// Route to update feedback for a user submission
router.put('/update', feedbackController.updateFeedback);

// Route to delete feedback for a user submission
router.delete('/delete/:submissionId', feedbackController.deleteFeedback);

// Route to analyze feedback trends for a user
router.get('/analyze/:userId', feedbackController.analyzeFeedbackTrends);

// Export the router
module.exports = router;
