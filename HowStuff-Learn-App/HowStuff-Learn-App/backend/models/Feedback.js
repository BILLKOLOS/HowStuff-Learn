const mongoose = require('mongoose');
const { Schema } = mongoose;

// Feedback Schema Definition
const feedbackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user providing feedback
        required: true,
    },
    contentId: {
        type: Schema.Types.ObjectId,
        ref: 'Content', // Reference to the content being reviewed
        required: true,
    },
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecture', // Reference to the lecture (if applicable)
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5, // Maximum rating
    },
    comments: {
        type: String,
        trim: true,
    },
    feedbackType: {
        type: String,
        required: true,
        enum: ['content', 'lecture'], // Type of feedback
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    response: {
        type: String,
        trim: true, // Optional response from educators or admins
    },
    isResolved: {
        type: Boolean,
        default: false, // Flag to indicate if feedback has been addressed
    },
    resolvedAt: {
        type: Date, // Timestamp for when feedback was resolved
    },
    // New fields for enhanced feedback management
    tags: {
        type: [String], // Array of tags for categorizing feedback
        default: [],
    },
    isAnonymous: {
        type: Boolean,
        default: false, // Indicates whether the feedback is anonymous
    },
    source: {
        type: String,
        enum: ['Web', 'Mobile', 'Survey'], // Source of feedback
        required: true,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Priority of the feedback
        default: 'Medium',
    },
    responseTime: {
        type: Date, // Date by which feedback is expected to be addressed
    },
    history: [{
        status: { type: String },
        response: { type: String },
        timestamp: { type: Date, default: Date.now },
    }],
    suggestions: {
        type: String,
        trim: true, // Optional suggestions from users
    },
});

// Middleware to update `updatedAt` before saving
feedbackSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to update `resolvedAt` when feedback is marked as resolved
feedbackSchema.pre('save', function(next) {
    if (this.isResolved && !this.resolvedAt) {
        this.resolvedAt = Date.now();
    }
    next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
