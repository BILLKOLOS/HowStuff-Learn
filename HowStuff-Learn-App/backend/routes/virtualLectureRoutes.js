const express = require('express');
const router = express.Router();
const VirtualLectureController = require('../controllers/VirtualLectureController');
const { isAuthenticated } = require('../middleware/auth');

// Create a new virtual lecture
router.post('/lectures', isAuthenticated, VirtualLectureController.createLecture);

// Join a scheduled virtual lecture
router.post('/lectures/:id/join', isAuthenticated, VirtualLectureController.joinLecture);

// Cancel a scheduled virtual lecture
router.delete('/lectures/:id/cancel', isAuthenticated, VirtualLectureController.cancelLecture);

// Get all scheduled lectures for the logged-in user
router.get('/lectures/user', isAuthenticated, VirtualLectureController.getUserLectures);

// Get details of a specific lecture
router.get('/lectures/:id', isAuthenticated, VirtualLectureController.getLectureDetails);

// Submit feedback after a lecture
router.post('/lectures/:id/feedback', isAuthenticated, VirtualLectureController.submitFeedback);

// Get feedback summary for a lecture
router.get('/lectures/:id/feedback/summary', isAuthenticated, VirtualLectureController.getFeedbackSummary);

// List all lectures for a specific topic
router.get('/lectures', VirtualLectureController.getLecturesByTopic);

// Enable live Q&A during lectures
router.post('/lectures/:id/live-qa', isAuthenticated, VirtualLectureController.enableLiveQandA);

// Mute a participant
router.post('/lectures/mute', isAuthenticated, VirtualLectureController.muteParticipant);

// Unmute a participant
router.post('/lectures/unmute', isAuthenticated, VirtualLectureController.unmuteParticipant);

// Optimize video/audio settings
router.post('/lectures/:id/media-settings', isAuthenticated, VirtualLectureController.optimizeMediaSettings);

// Record lecture session
router.post('/lectures/:id/record', isAuthenticated, VirtualLectureController.recordLecture);

// Get recording of the lecture
router.get('/lectures/:id/recording', isAuthenticated, VirtualLectureController.getLectureRecording);

module.exports = router;

