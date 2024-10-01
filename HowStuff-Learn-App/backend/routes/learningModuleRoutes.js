const express = require('express');
const router = express.Router();
const learningModuleController = require('../controllers/learningModuleController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new learning module
router.post('/', authMiddleware.verifyToken, learningModuleController.createLearningModule);

// Get all learning modules
router.get('/', learningModuleController.getLearningModules);

// Update an existing learning module
router.put('/:moduleId', authMiddleware.verifyToken, learningModuleController.updateLearningModule);

// Delete a learning module
router.delete('/:moduleId', authMiddleware.verifyToken, learningModuleController.deleteLearningModule);

// Get activities in a learning module
router.get('/:moduleId/activities', learningModuleController.getActivities);

// Get prerequisites for a specific learning module
router.get('/:moduleId/prerequisites', learningModuleController.getPrerequisites);

// Search learning modules by keyword
router.get('/search', learningModuleController.searchLearningModules);

// Get user-specific learning modules
router.get('/user/:userId', learningModuleController.getUserLearningModules);

// Rate a learning module
router.post('/:moduleId/rate', authMiddleware.verifyToken, learningModuleController.rateLearningModule);

// Get average rating for a learning module
router.get('/:moduleId/rating', learningModuleController.getAverageRating);

// Add comment to a learning module
router.post('/:moduleId/comment', authMiddleware.verifyToken, learningModuleController.addComment);

// Get comments for a learning module
router.get('/:moduleId/comments', learningModuleController.getComments);

module.exports = router;

