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
    skillsDeveloped: [{
        type: String, // Skill or competency name
        required: true,
    }],
    prerequisites: [{
        type: String, // Name of the prerequisite
    }],
    estimatedDuration: {
        type: Number, // Duration in hours
        required: true,
    },
    learningObjectives: [{
        type: String, // Objective statement
        required: true,
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
    relatedResources: [{
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    }],
    isActive: {
        type: Boolean,
        default: true, // Indicates if the learning path is currently active
    },
    progress: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        completedModules: [{
            type: Schema.Types.ObjectId,
            ref: 'Module', // Reference to completed modules
        }],
        lastAccessed: {
            type: Date,
            default: Date.now, // Last time the user accessed this learning path
        },
    }],
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
