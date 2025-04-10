const mongoose = require('mongoose');
const { Schema } = mongoose;

// Question Schema Definition
const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        option: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
    }],
    feedback: {
        type: String,
        default: '', // Optional feedback for incorrect answers
    },
});

// Assessment Schema Definition
const assessmentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true, // Index for faster queries
    },
    description: {
        type: String,
        required: true,
    },
    questions: [questionSchema], // Array of question objects
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['math', 'science', 'language', 'arts', 'history', 'technology'],
        index: true, // Index for faster queries
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['children', 'teens', 'adults'],
        index: true,
    },
    difficultyLevel: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'],
        index: true,
    },
    tags: [{
        type: String,
        index: true, // Index for faster queries
    }],
    type: {
        type: String,
        required: true,
        enum: ['quiz', 'exam', 'survey'],
        index: true,
    },
    relatedLearningPath: {
        type: Schema.Types.ObjectId,
        ref: 'LearningPath',
    },
    timeLimit: {
        type: Number,
        min: 1, // Ensure time limit is a positive integer
    },
    passingScore: {
        type: Number,
        required: true,
        default: 50, // Default passing score
    },
    reward: {
        type: Schema.Types.ObjectId,
        ref: 'Badge', // Badge or reward for completing the assessment
    },
    maxAttempts: {
        type: Number,
        default: 3, // Maximum number of attempts
    },
    attempts: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        score: {
            type: Number,
        },
        attemptDate: {
            type: Date,
            default: Date.now,
        },
    }],
    isAdaptive: {
        type: Boolean,
        default: false, // Indicates if adaptive learning is enabled
    },
    scoringMethod: {
        type: String,
        required: true,
        enum: ['percentage', 'points'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` before saving
assessmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create models
const Question = mongoose.model('Question', questionSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
