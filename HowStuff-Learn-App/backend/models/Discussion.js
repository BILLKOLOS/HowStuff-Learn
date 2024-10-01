const mongoose = require('mongoose');

// Define the Discussion schema
const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User' // Reference to the User model
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isAnonymous: {
            type: Boolean,
            default: false // Indicates if the comment is anonymous
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    isClosed: {
        type: Boolean,
        default: false // Indicates if the discussion is closed for further comments
    },
    relatedResourceIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExternalResource' // Reference to ExternalResource model
    }],
    discussionType: {
        type: String,
        enum: ['question', 'general', 'feedback'], // Types of discussions
        required: true,
    },
    poll: {
        question: {
            type: String,
            trim: true
        },
        options: [{
            option: {
                type: String,
                required: true
            },
            votes: {
                type: Number,
                default: 0 // Votes for the option
            }
        }]
    },
    status: {
        type: String,
        enum: ['active', 'resolved', 'archived'], // Discussion statuses
        default: 'active' // Default status
    },
    lastActiveAt: {
        type: Date,
        default: Date.now // Timestamp for the last activity
    },
    closedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    closureReason: {
        type: String,
        trim: true // Reason for closing the discussion
    },
});

// Create the Discussion model
const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
