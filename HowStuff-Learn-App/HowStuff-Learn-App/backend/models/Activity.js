const mongoose = require('mongoose');
const { Schema } = mongoose;

// Activity Schema Definition
const activitySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    suggestedAgeGroup: {
        type: String,
        enum: ['0-2', '3-5', '6-8', '9-12', '13+'], // Age groups for suggestions
        required: true,
    },
    materialsNeeded: {
        type: [String], // Array of materials needed for the activity
        default: [],
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
        min: 1, // Minimum duration should be at least 1 minute
    },
    learningObjectives: {
        type: [String], // Array of learning objectives for the activity
        default: [],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the activity
        required: true,
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
activitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
