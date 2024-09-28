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
    // New field to store the user's mood or feelings during reflection
    mood: {
        type: String,
        enum: ['happy', 'neutral', 'sad', 'frustrated', 'motivated'], // Possible moods during reflection
        default: 'neutral', // Default mood
    },
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
