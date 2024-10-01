const mongoose = require('mongoose');
const { Schema } = mongoose;

// Reflection Schema Definition
const reflectionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the reflection
        required: true,
    },
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module', // Reference to the learning module being reflected upon
        required: true,
    },
    reflectionText: {
        type: String,
        required: true, // The text of the user's reflection
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the reflection was created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the reflection was last updated
    },
    mood: {
        type: String,
        enum: ['happy', 'neutral', 'sad', 'frustrated', 'motivated'], // Possible moods during reflection
        default: 'neutral', // Default mood
    },
    learningGoals: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningGoal', // Reference to the user's learning goals
    }],
    type: {
        type: String,
        enum: ['personal', 'academic', 'feedback', 'insight'],
        required: true,
    },
    relatedResources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource', // Reference to related resources
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5, // Scale of 1 to 5
        default: 3, // Default rating
    },
    visibility: {
        type: String,
        enum: ['private', 'public', 'shared'],
        default: 'private', // Default visibility
    },
    peerFeedback: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' }, // User providing feedback
        comment: { type: String, required: true }, // Comment text
        createdAt: { type: Date, default: Date.now }, // Timestamp of feedback
    }],
    duration: { type: Number }, // Duration in minutes
});

// Middleware to update `updatedAt` before saving
reflectionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Reflection model
const Reflection = mongoose.model('Reflection', reflectionSchema);

// Export the Reflection model
module.exports = Reflection;
