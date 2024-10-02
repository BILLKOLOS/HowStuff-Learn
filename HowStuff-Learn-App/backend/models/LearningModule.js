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
    content: { // New field for module content
        type: String, // Could be text, markdown, or other formats
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
    estimatedDuration: {
        type: Number, // Duration in minutes
        required: true,
    },
    prerequisites: [{
        type: String, // Name of the prerequisite
    }],
    skillsDeveloped: [{
        type: String, // Skill or competency name
        required: true,
    }],
    interactiveElements: [{
        type: Schema.Types.ObjectId,
        ref: 'InteractiveContent', // Reference to interactive content
    }],
    userProgress: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the user
            required: true,
        },
        completedActivities: [{
            type: String, // Activity identifier or title
        }],
        lastAccessed: {
            type: Date,
            default: Date.now, // Timestamp of last access
        },
        isCompleted: { // New field to indicate completion
            type: Boolean,
            default: false,
        }
    }],
    completedUsers: [{ // New field to track users who completed the module
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    feedback: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
        default: true, // Indicates if the learning module is currently active
    },
});

// Middleware to update `updatedAt` before saving
learningModuleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const LearningModule = mongoose.model('LearningModule', learningModuleSchema);

module.exports = LearningModule;
