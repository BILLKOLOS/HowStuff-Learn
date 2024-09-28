const mongoose = require('mongoose');
const { Schema } = mongoose;

// Learning Path Schema Definition
const learningPathSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends
    },
    description: {
        type: String,
        required: true, // Brief description of the learning path
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the learning path
        required: true,
    },
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module', // Array of references to the associated learning modules
    }],
    targetAudience: {
        type: String,
        required: true,
        enum: ['children', 'teens', 'adults'], // Specifies the intended audience
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the learning path was created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the learning path was last updated
    },
});

// Middleware to update `updatedAt` before saving
learningPathSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Learning Path model
const LearningPath = mongoose.model('LearningPath', learningPathSchema);

// Export the Learning Path model
module.exports = LearningPath;
