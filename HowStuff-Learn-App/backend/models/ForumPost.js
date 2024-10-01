const mongoose = require('mongoose');
const { Schema } = mongoose;

// Forum Post Schema Definition
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
    category: {
        type: String,
        required: true,
        enum: ['General', 'Technical', 'Feedback', 'Q&A'], // Define categories
    },
    status: {
        type: String,
        enum: ['Open', 'Resolved', 'Closed'], // Post status options
        default: 'Open',
    },
    views: {
        type: Number,
        default: 0, // Number of times the post has been viewed
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
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users who liked the post
    }],
    upvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users who upvoted the post
    }],
    downvotes: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users who downvoted the post
    }],
    attachments: [{
        url: {
            type: String,
            required: false,
            validate: {
                validator: function(v) {
                    return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Validate URL format
                },
                message: props => `${props.value} is not a valid URL!`,
            },
        },
        description: { type: String, required: false }, // Optional description for the attachment
    }],
    poll: {
        question: { type: String, required: true }, // Poll question
        options: [{ option: { type: String, required: true } }], // Options for the poll
        responses: [{
            user: { type: Schema.Types.ObjectId, ref: 'User' }, // User who responded
            selectedOption: { type: Number, required: true }, // Index of selected option
        }],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    edited: {
        type: Boolean,
        default: false, // Indicates if the post has been edited
    },
    editedAt: {
        type: Date,
        default: null, // Timestamp for when the post was edited
    },
});

// Middleware to update `updatedAt` before saving
forumPostSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

module.exports = ForumPost;
