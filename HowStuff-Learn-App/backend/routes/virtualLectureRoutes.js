const express = require('express'); 
const router = express.Router();
const VirtualLectureController = require('../controllers/VirtualLectureController');
const { verifyToken } = require('../middleware/authMiddleware'); // Updated import

// Log to check if the controller is imported correctly
console.log('VirtualLectureController:', VirtualLectureController);

// Log each method to see if they are defined
console.log('createLecture Method:', VirtualLectureController.createLecture);
console.log('joinLecture Method:', VirtualLectureController.joinLecture);
console.log('cancelLecture Method:', VirtualLectureController.cancelLecture);
console.log('getUserLectures Method:', VirtualLectureController.getUserLectures);
console.log('getLectureDetails Method:', VirtualLectureController.getLectureDetails);
console.log('submitFeedback Method:', VirtualLectureController.submitFeedback);
console.log('getFeedbackSummary Method:', VirtualLectureController.getFeedbackSummary);
console.log('getLecturesByTopic Method:', VirtualLectureController.getLecturesByTopic);
console.log('enableLiveQandA Method:', VirtualLectureController.enableLiveQandA);
console.log('muteParticipant Method:', VirtualLectureController.muteParticipant);
console.log('unmuteParticipant Method:', VirtualLectureController.unmuteParticipant);
console.log('optimizeMediaSettings Method:', VirtualLectureController.optimizeMediaSettings);
console.log('recordLecture Method:', VirtualLectureController.recordLecture);
console.log('getLectureRecording Method:', VirtualLectureController.getLectureRecording);

// Create a new virtual lecture
router.post('/lectures', verifyToken, VirtualLectureController.createLecture);

// Join a scheduled virtual lecture
router.post('/lectures/:id/join', verifyToken, VirtualLectureController.joinLecture);

// Cancel a scheduled virtual lecture
router.delete('/lectures/:id/cancel', verifyToken, VirtualLectureController.cancelLecture);

// Get all scheduled lectures for the logged-in user
router.get('/lectures/user', verifyToken, VirtualLectureController.getUserLectures);

// Get details of a specific lecture
router.get('/lectures/:id', verifyToken, VirtualLectureController.getLectureDetails);

// Submit feedback after a lecture
router.post('/lectures/:id/feedback', verifyToken, VirtualLectureController.submitFeedback);

// Get feedback summary for a lecture
router.get('/lectures/:id/feedback/summary', verifyToken, VirtualLectureController.getFeedbackSummary);

// List all lectures for a specific topic
router.get('/lectures', VirtualLectureController.getLecturesByTopic);

// Enable live Q&A during lectures
router.post('/lectures/:id/live-qa', verifyToken, VirtualLectureController.enableLiveQandA);

// Mute a participant
router.post('/lectures/mute', verifyToken, VirtualLectureController.muteParticipant);

// Unmute a participant
router.post('/lectures/unmute', verifyToken, VirtualLectureController.unmuteParticipant);

// Optimize video/audio settings
router.post('/lectures/:id/media-settings', verifyToken, VirtualLectureController.optimizeMediaSettings);

// Record lecture session
router.post('/lectures/:id/record', verifyToken, VirtualLectureController.recordLecture);

// Get recording of the lecture
router.get('/lectures/:id/recording', verifyToken, VirtualLectureController.getLectureRecording);

module.exports = router;
