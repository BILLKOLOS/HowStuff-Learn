const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User registration
router.post('/register', userController.register); // Route for registering a new user

// User login
router.post('/login', userController.login); // Route for logging in a user

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

// Search for educational resources (using OpenAI and/or Wikipedia APIs)
router.get('/search', authMiddleware.verifyToken, userController.searchResources);

// Save the user's search history
router.post('/search/history', authMiddleware.verifyToken, userController.saveSearchHistory);

// Retrieve the user's search history
router.get('/search/history', authMiddleware.verifyToken, userController.getSearchHistory);

module.exports = router;
