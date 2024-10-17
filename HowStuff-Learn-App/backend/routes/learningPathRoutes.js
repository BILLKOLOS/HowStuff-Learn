// routes/learningPathRoutes.js

const express = require('express');
const router = express.Router();
const LearningPathController = require('../controllers/learningPathController');
const { verifyToken, verifyAdmin, verifyParent, verifyEducator } = require('../middleware/authMiddleware'); // Adjust based on your middleware names

// Debugging: Log the imported controller to verify functions
console.log('LearningPathController:', LearningPathController);

// Create a new learning path
router.post('/', verifyToken, LearningPathController.createLearningPath);

// Get all learning paths for the authenticated user
router.get('/', verifyToken, LearningPathController.getUserLearningPathsEndpoint);

// Get a specific learning path by ID
router.get('/:pathId', verifyToken, LearningPathController.getLearningPathById);

// Update an existing learning path by ID
router.put('/:pathId', verifyToken, LearningPathController.updateLearningPath);

// Delete a learning path by ID
router.delete('/:pathId', verifyToken, LearningPathController.deleteLearningPath);

// Get AI-based learning path recommendations
router.get('/recommendations', verifyToken, LearningPathController.getAIRecommendations);

// Track user progress in a learning path
router.post('/progress', verifyToken, LearningPathController.trackUserProgress);

// Retrieve progress in a specific learning path
router.get('/progress/:pathId', verifyToken, LearningPathController.getLearningPathProgress);

// Get details of a specific module in a learning path
router.get('/modules/:moduleId', verifyToken, LearningPathController.getModuleDetails);

// Provide feedback on a learning path
router.post('/feedback', verifyToken, LearningPathController.provideFeedback);

// Recommend learning paths based on user profile and progress
router.get('/recommendations/user', verifyToken, LearningPathController.recommendLearningPaths);

// Get history of learning path changes for a user
router.get('/history', verifyToken, LearningPathController.getLearningPathHistory);

module.exports = router;
