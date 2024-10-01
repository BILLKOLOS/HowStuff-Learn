const express = require('express');
const { 
    recordLecture,
    getLectureRecording,
    getUserRecordedLectures,
    deleteLectureRecording 
} = require('../controllers/lectureRecordingController');
const router = express.Router();

// Route for recording a lecture
router.post('/lectures/record', recordLecture);

// Route for getting the recording of a specific lecture
router.get('/lectures/:lectureId/recording', getLectureRecording);

// Route for getting all recorded lectures for a user
router.get('/lectures/user/:userId/recorded', getUserRecordedLectures);

// Route for deleting a recording of a specific lecture
router.delete('/lectures/:lectureId/recording', deleteLectureRecording);

module.exports = router;

