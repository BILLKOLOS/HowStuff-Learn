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
    // New field to provide feedback for each question
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
    },
    description: {
        type: String,
        required: true,
    },
    questions: [questionSchema], // Array of question objects
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the assessment
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['math', 'science', 'language', 'arts', 'history', 'technology'], // Categories for assessments
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['children', 'teens', 'adults'], // Specifies the audience for the assessment
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    // New field for assessing difficulty level
    difficultyLevel: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard'], // Difficulty levels for assessments
    },
    // New field for tags to enhance searchability
    tags: [{
        type: String, // Array of tags for better categorization
    }],
});

// Middleware to update `updatedAt` before saving
assessmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create models
const Question = mongoose.model('Question', questionSchema); // Optional if you want to manage questions separately
const Assessment = mongoose.model('Assessment', assessmentSchema);

// Export the Assessment model
module.exports = Assessment;
