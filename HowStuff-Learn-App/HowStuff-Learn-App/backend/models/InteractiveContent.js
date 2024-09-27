const mongoose = require('mongoose');
const { Schema } = mongoose;

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
interactiveContentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const InteractiveContent = mongoose.model('InteractiveContent', interactiveContentSchema);

module.exports = InteractiveContent;

