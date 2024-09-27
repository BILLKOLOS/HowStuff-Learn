const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User registration
router.post('/register', userController.register);

// User login
router.post('/login', userController.login);

// Link child's account
router.post('/link-child', authMiddleware.verifyToken, userController.linkChildAccount);

// Create a child account
router.post('/create-child', authMiddleware.verifyToken, userController.createChildAccount);

// Unlink a child account
router.delete('/unlink-child', authMiddleware.verifyToken, userController.unlinkChildAccount);

// View child accounts
router.get('/children', authMiddleware.verifyToken, userController.viewChildAccounts);

// Update user profile
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);

// Delete user account
router.delete('/account', authMiddleware.verifyToken, userController.deleteAccount);

// Search resources
router.get('/search', authMiddleware.verifyToken, userController.searchResources);

// Save search history
router.post('/search/history', authMiddleware.verifyToken, userController.saveSearchHistory);

// Get search history
router.get('/search/history', authMiddleware.verifyToken, userController.getSearchHistory);

module.exports = router;
