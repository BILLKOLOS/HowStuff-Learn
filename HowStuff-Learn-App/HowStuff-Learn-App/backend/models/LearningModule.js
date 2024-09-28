const mongoose = require('mongoose');
const { Schema } = mongoose;

// Learning Module Schema Definition
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
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource', // Reference to related educational resources
    }],
    assessments: [{
        type: Schema.Types.ObjectId,
        ref: 'Assessment', // Reference to assessments linked to this module
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the module
        required: true,
    },
    gradeLevel: {
        type: String, // Optional: Grade level this module targets (e.g., Grade 6)
    },
    subject: {
        type: String, // Optional: Subject area this module covers (e.g., Science)
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
