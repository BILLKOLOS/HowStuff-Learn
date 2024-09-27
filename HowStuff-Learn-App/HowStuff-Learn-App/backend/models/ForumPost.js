const mongoose = require('mongoose');
const { Schema } = mongoose;

const forumPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    tags: {
        type: [String], // Array of tags for categorizing posts
        default: [],
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` before saving
forumPostSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;

