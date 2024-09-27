const express = require('express');
const router = express.Router();
const interactiveContentController = require('../controllers/interactiveContentController');

// Create interactive content
router.post('/', interactiveContentController.createInteractiveContent);

// Retrieve interactive content
router.get('/', interactiveContentController.getInteractiveContent);

// Update interactive content
router.put('/:id', interactiveContentController.updateInteractiveContent);

// Delete interactive content
router.delete('/:id', interactiveContentController.deleteInteractiveContent);

// Get content usage analytics
router.get('/:id/analytics', interactiveContentController.getContentUsageAnalytics);

// Rate interactive content
router.post('/:id/rate', interactiveContentController.rateInteractiveContent);

// Get average rating of interactive content
router.get('/:id/rating', interactiveContentController.getAverageRating);

// Add comments to interactive content
router.post('/:id/comments', interactiveContentController.addComment);

// Get comments for interactive content
router.get('/:id/comments', interactiveContentController.getComments);

// Get all interactive content for a specific subject
router.get('/subject/:subject', interactiveContentController.getAllContentBySubject);

// Get trending interactive content
router.get('/trending', interactiveContentController.getTrendingContent);

module.exports = router;

