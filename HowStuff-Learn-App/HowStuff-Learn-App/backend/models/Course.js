const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule' }],
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
    level: {
        type: String, // e.g., 'Undergraduate', 'Master's', 'PhD'
        required: true,
    },
    duration: {
        type: String, // e.g., '3 months'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for the instructor
        required: true,
    },
    enrollmentCapacity: {
        type: Number,
        default: 30, // Default capacity
    },
    enrollmentDeadline: {
        type: Date,
    },
    format: {
        type: String,
        enum: ['online', 'offline', 'hybrid'], // Course delivery formats
        required: true,
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to other Course models
    }],
    ratings: {
        type: [Number],
        default: [], // Array to store user ratings
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        comment: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    featuredImage: {
        type: String, // URL or path to the image file
    },
    tags: [{
        type: String, // Array of tags
        trim: true,
    }],
});

module.exports = mongoose.model('Course', CourseSchema);
