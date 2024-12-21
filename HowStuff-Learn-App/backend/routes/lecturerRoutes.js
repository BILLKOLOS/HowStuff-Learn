const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController'); // Import the lecturer controller

// POST request to create a new lecturer
router.post('/', lecturerController.createLecturer); // This handles creating a new lecturer

// Lecturer login
router.post('/login', lecturerController.login); // This handles lecturer login

module.exports = router;
