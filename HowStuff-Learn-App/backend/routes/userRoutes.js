const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const progressController = require('../controllers/progressController');

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

// Link a child's account to the parent account
router.post('/link-child', authMiddleware.verifyToken, userController.linkChildAccount);

// Create a new child account under the parent account
router.post('/create-child', authMiddleware.verifyToken, userController.createChildAccount);

// Unlink a child account from the parent account
router.delete('/unlink-child', authMiddleware.verifyToken, userController.unlinkChildAccount);

// View all linked child accounts for the parent
router.get('/children', authMiddleware.verifyToken, userController.viewChildAccounts);

// Update the user's profile
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);

// Delete the user's account
router.delete('/account', authMiddleware.verifyToken, userController.deleteAccount);

// Search for educational resources
router.get('/search', authMiddleware.verifyToken, userController.searchResources);

// View user's profile
router.get('/profile', authMiddleware.verifyToken, userController.getProfile); // New route to get user profile

// Progress management routes
router.post('/progress', authMiddleware.verifyToken, progressController.updateProgress);
router.get('/progress/:userId', authMiddleware.verifyToken, progressController.getProgressReport);
router.post('/progress/goals', authMiddleware.verifyToken, progressController.setLearningGoals);
router.get('/progress/details/:userId', authMiddleware.verifyToken, progressController.getDetailedProgressReport);
router.get('/progress/behavior/:userId', authMiddleware.verifyToken, progressController.analyzeUserBehavior);
router.get('/progress/historical/:userId', authMiddleware.verifyToken, progressController.getHistoricalProgressTrends);

module.exports = router;
