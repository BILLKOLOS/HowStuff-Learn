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

// Update user profile
router.put('/profile', authMiddleware.verifyToken, userController.updateProfile);

module.exports = router;

