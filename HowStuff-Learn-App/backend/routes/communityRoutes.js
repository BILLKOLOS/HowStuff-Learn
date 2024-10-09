const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');
console.log('Community Controller:', communityController);


// Create a new forum post
router.post('/', authMiddleware, communityController.createPost);

// Get all forum posts
router.get('/', communityController.getAllPosts);

// Get a single post by ID
router.get('/:postId', communityController.getPostById);

// Update a forum post
router.put('/:postId', authMiddleware, communityController.updatePost);

// Delete a forum post
router.delete('/:postId', authMiddleware, communityController.deletePost);

// Comment on a forum post
router.post('/:postId/comments', authMiddleware, communityController.addComment);

// Search posts by title or content
router.get('/search', communityController.searchPosts);

// Get posts by a specific author
router.get('/author/:authorId', communityController.getPostsByAuthor);

// Get trending posts
router.get('/trending', communityController.getTrendingPosts);

// Like a post
router.post('/:postId/like', authMiddleware, communityController.likePost);

// Dislike a post
router.post('/:postId/dislike', authMiddleware, communityController.dislikePost);

// Get paginated posts
router.get('/paginated', communityController.getPaginatedPosts);

// Get recent posts
router.get('/recent', communityController.getRecentPosts);

module.exports = router;
