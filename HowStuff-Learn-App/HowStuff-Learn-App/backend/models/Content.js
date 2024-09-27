const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['math', 'science', 'language', 'arts', 'history', 'technology', 'other'],
    },
    tags: [{
        type: String,
        trim: true,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the content
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true, // URL to the educational material (video, article, etc.)
    },
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
contentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;

