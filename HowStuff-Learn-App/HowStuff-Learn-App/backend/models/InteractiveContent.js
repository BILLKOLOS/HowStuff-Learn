const mongoose = require('mongoose');
const { Schema } = mongoose;

// Interactive Content Schema Definition
const interactiveContentSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        enum: ['video', 'quiz', 'simulation', 'game'], // Types of interactive content
        required: true,
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Validate URL format
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    learningModule: {
        type: Schema.Types.ObjectId,
        ref: 'LearningModule', // Reference to the LearningModule model
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (educator or creator)
        required: true,
    },
    tags: [{
        type: String, // Tags for categorization
    }],
    duration: { 
        type: Number, 
        required: true, // Duration in minutes
    },
    difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'], // Difficulty levels
        required: true,
    },
    learningObjectives: [{
        type: String, // Objectives for the content
    }],
    feedback: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the user giving feedback
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    version: {
        type: Number,
        default: 1, // Initial version
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true, // Indicates if the content is currently active
    },
});

// Middleware to update `updatedAt` before saving
interactiveContentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const InteractiveContent = mongoose.model('InteractiveContent', interactiveContentSchema);

module.exports = InteractiveContent;
