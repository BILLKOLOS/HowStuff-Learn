const express = require('express'); 
const router = express.Router();
const userController = require('../controllers/userController');
const progressController = require('../controllers/ProgressController');
const parentChildController = require('../controllers/parentChildController');
const authMiddleware = require('../middleware/authMiddleware');

// User Registration and Authentication Routes
router.post('/register', userController.register);  // User registration
router.post('/login', userController.login);        // User login
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile); // Update user profile
router.get('/profile', authMiddleware.verifyToken, userController.getProfile);      // View user profile
router.delete('/account', authMiddleware.verifyToken, userController.deleteAccount); // Delete user account

// Parent-Child Relationship Management Routes
router.post('/children/link', authMiddleware.verifyToken, parentChildController.linkChildToParent);   // Link child account to parent
router.post('/children/create', authMiddleware.verifyToken, userController.createChildAccount); // Create new child account
router.delete('/children/unlink', authMiddleware.verifyToken, parentChildController.unlinkChildFromParent); // Unlink child account from parent
router.get('/children', authMiddleware.verifyToken, userController.viewChildAccounts);  // View all linked child accounts for the parent

// Child Progress Management Routes
router.get('/parent/:parentId/child/:childId/progress', authMiddleware.verifyToken, parentChildController.viewChildProgress); // View child's progress
router.get('/parent/:parentId/children', authMiddleware.verifyToken, parentChildController.getLinkedChildren); // Get linked children

// Educational Resource Search Route
router.get('/search', authMiddleware.verifyToken, userController.searchResources); // Search for educational resources

// Progress Management Routes
router.post('/progress', authMiddleware.verifyToken, progressController.updateProgress);  // Update progress
router.get('/progress/:userId', authMiddleware.verifyToken, progressController.getProgressReport); // View progress report
router.post('/progress/goals', authMiddleware.verifyToken, progressController.setLearningGoals); // Set learning goals
router.get('/progress/details/:userId', authMiddleware.verifyToken, progressController.getDetailedProgressReport); // Get detailed progress report
router.get('/progress/behavior/:userId', authMiddleware.verifyToken, progressController.analyzeUserBehavior); // Analyze user behavior
router.get('/progress/historical/:userId', authMiddleware.verifyToken, progressController.getHistoricalProgressTrends); // Get historical progress trends

module.exports = router;
