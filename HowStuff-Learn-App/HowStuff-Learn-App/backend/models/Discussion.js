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
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    isClosed: {
        type: Boolean,
        default: false // Indicates if the discussion is closed for further comments
    }
});

// Create the Discussion model
const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
