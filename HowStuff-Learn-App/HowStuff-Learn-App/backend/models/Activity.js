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
        enum: ['0-2', '3-5', '6-8', '9-12', '13+'],
        required: true,
    },
    materialsNeeded: {
        type: [String], // Array of materials needed for the activity
        default: [],
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
        min: 1,
    },
    learningObjectives: {
        type: [String], // Array of learning objectives for the activity
        default: [],
    },
    type: {
        type: String,
        required: true,
        enum: ['individual', 'group', 'interactive'],
    },
    skillLevel: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    reward: {
        type: Schema.Types.ObjectId,
        ref: 'Badge', // Badge or reward earned upon activity completion
    },
    completionStatus: {
        type: String,
        required: true,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started',
    },
    completedAt: {
        type: Date,
    },
    relatedLearningPath: {
        type: Schema.Types.ObjectId,
        ref: 'LearningPath', // Reference to related learning path
    },
    studyGroup: {
        type: Schema.Types.ObjectId,
        ref: 'StudyGroup', // Reference to a study group
    },
    media: [{
        type: String, // URLs to media resources
    }],
    relatedAssessment: {
        type: Schema.Types.ObjectId,
        ref: 'Assessment', // Link to related assessment
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
