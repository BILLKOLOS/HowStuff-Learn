const express = require('express');
const { 
    scheduleLecture,
    confirmLecture,
    cancelLecture,
    getUserLectures,
    getLectureDetails 
} = require('../controllers/lectureSchedulingController');
const router = express.Router();

// Route for scheduling a lecture
router.post('/lectures', scheduleLecture);

// Route for confirming a scheduled lecture
router.put('/lectures/confirm/:lectureId', confirmLecture);

// Route for canceling a scheduled lecture
router.delete('/lectures/:lectureId', cancelLecture);

// Route for getting all scheduled lectures for a user
router.get('/lectures/user/:userId', getUserLectures);

// Route for getting details of a specific lecture
router.get('/lectures/:lectureId', getLectureDetails);

module.exports = router;

