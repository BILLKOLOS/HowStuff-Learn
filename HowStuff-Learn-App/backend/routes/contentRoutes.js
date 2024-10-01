const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Create new content
router.post('/', authMiddleware.verifyToken, contentController.createContent);

// Retrieve content
router.get('/', contentController.getContent);

// Update existing content
router.put('/:contentId', authMiddleware.verifyToken, contentController.updateContent);

// Soft delete content
router.patch('/:contentId', authMiddleware.verifyToken, contentController.softDeleteContent);

// Track content engagement
router.post('/:contentId/engagement', authMiddleware.verifyToken, contentController.trackContentEngagement);

// Recommend related content
router.get('/:contentId/recommendations', contentController.recommendContent);

// Rate content
router.post('/:contentId/rate', authMiddleware.verifyToken, contentController.rateContent);

// Get average rating for content
router.get('/:contentId/rating', contentController.getAverageRating);

module.exports = router;

