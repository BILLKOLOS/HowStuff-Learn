const ForumPost = require('../models/ForumPost');
const User = require('../models/User');
const notificationService = require('../utils/notificationService'); // For notifications related to posts

// Create a new forum post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        const newPost = await ForumPost.create({
            title,
            content,
            author: userId,
            createdAt: new Date(),
        });

        // Notify users about the new post (optional)
        const users = await User.find();
        users.forEach(async (user) => {
            await notificationService.sendNewPostNotification(user.email, newPost);
        });

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create post', error });
    }
};

// Get all forum posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find().populate('author', 'name email');
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve posts', error });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await ForumPost.findById(postId).populate('author', 'name email');
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve post', error });
    }
};

// Update a forum post
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, content } = req.body;

        const updatedPost = await ForumPost.findByIdAndUpdate(
            postId,
            { title, content },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update post', error });
    }
};

// Delete a forum post
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await ForumPost.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete post', error });
    }
};

// Comment on a forum post
exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;

        const post = await ForumPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ user: userId, comment, createdAt: new Date() });
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add comment', error });
    }
};

// Search posts by title or content
exports.searchPosts = async (req, res) => {
    try {
        const { query } = req.query; // Assuming the search term is passed as a query parameter
        const posts = await ForumPost.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        }).populate('author', 'name email');
        
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search posts', error });
    }
};

// Get posts by author
exports.getPostsByAuthor = async (req, res) => {
    try {
        const { authorId } = req.params;
        const posts = await ForumPost.find({ author: authorId }).populate('author', 'name email');
        
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this author' });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve posts by author', error });
    }
};

// Get trending posts (e.g., based on number of comments)
exports.getTrendingPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find().sort({ 'comments.length': -1 }).limit(5).populate('author', 'name email');
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve trending posts', error });
    }
};

// Like a post
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await ForumPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user already liked the post
        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        post.likes.push(userId);
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to like post', error });
    }
};

// Dislike a post
exports.dislikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const post = await ForumPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has liked the post
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this post yet' });
        }

        post.likes = post.likes.filter(id => id !== userId);
        await post.save();

        res.status(200).json({ message: 'Post disliked successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to dislike post', error });
    }
};

// Get posts with pagination
exports.getPaginatedPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10
        const posts = await ForumPost.find()
            .populate('author', 'name email')
            .skip((page - 1) * limit)
            .limit(limit);
        
        const totalPosts = await ForumPost.countDocuments();
        res.status(200).json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve paginated posts', error });
    }
};

// Get recent posts
exports.getRecentPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find().sort({ createdAt: -1 }).limit(5).populate('author', 'name email');
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve recent posts', error });
    }
};

