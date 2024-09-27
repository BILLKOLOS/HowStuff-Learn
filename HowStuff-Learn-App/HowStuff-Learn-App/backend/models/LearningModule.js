const mongoose = require('mongoose');
const { Schema } = mongoose;

const learningModuleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    objectives: [{
        type: String,
        required: true,
    }],
    activities: [{
        type: String,
        required: true,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the module
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
learningModuleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const LearningModule = mongoose.model('LearningModule', learningModuleSchema);

module.exports = LearningModule;

