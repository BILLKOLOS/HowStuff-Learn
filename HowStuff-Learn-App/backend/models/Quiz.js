const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for multimedia elements
const multimediaSchema = new Schema({
    type: {
        type: String,
        enum: ['image', 'video', 'audio'],
        required: true
    },
    url: { type: String, required: true },
    caption: { type: String }
});

// Define the schema for each question in a quiz
const questionSchema = new Schema({
    questionText: { type: String, required: true },
    options: [{
        optionText: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    }],
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    points: { type: Number, default: 1 },
    multimedia: [multimediaSchema],
    tags: [{ type: String }]
});

// Define the schema for the quiz
const quizSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    subject: { type: String, required: true },
    questions: [questionSchema],
    totalPoints: { type: Number, default: 0 },
    passingScore: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    randomizeQuestions: { type: Boolean, default: false },
    isAdaptive: { type: Boolean, default: false },
    recommendedResources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
