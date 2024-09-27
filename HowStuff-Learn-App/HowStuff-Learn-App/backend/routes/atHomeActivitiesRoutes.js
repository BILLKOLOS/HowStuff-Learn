const express = require('express');
const router = express.Router();
const atHomeActivitiesController = require('../controllers/atHomeActivitiesController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to suggest activities automatically based on today's events
router.post('/suggest', authMiddleware, atHomeActivitiesController.suggestActivitiesAutomatically);

// Route to get activities by age group
router.get('/:ageGroup', authMiddleware, atHomeActivitiesController.getActivitiesByAgeGroup);

// Route to get activity details by ID
router.get('/activity/:activityId', authMiddleware, atHomeActivitiesController.getActivityById);

// Route to update an existing activity
router.put('/activity/:activityId', authMiddleware, atHomeActivitiesController.updateActivity);

// Route to delete an activity
router.delete('/activity/:activityId', authMiddleware, atHomeActivitiesController.deleteActivity);

module.exports = router;

