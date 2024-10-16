const mongoose = require('mongoose');

// Schema for multimedia elements
const multimediaSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['image', 'video', 'audio'], // Types of multimedia elements
        required: true
    },
    url: { type: String, required: true }, // URL to the multimedia resource
    caption: { type: String } // Optional caption for the multimedia element
});

// Schema for each question in a quiz
const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true }, // The actual question text
    options: [{ 
        optionText: { type: String, required: true }, // Text of the answer option
        isCorrect: { type: Boolean, required: true }  // Is this option correct?
    }],
    questionType: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay'], // Additional question type
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'], // Difficulty levels for the question
        required: true
    },
    points: { type: Number, default: 1 }, // Points awarded for a correct answer
    multimedia: [multimediaSchema], // Optional multimedia elements for the question
    tags: [{ type: String }], // Tags for question categorization (e.g., 'science', 'math')
});

// Schema for the quiz
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Title of the quiz
    description: { type: String }, // Optional description of the quiz
    subject: { type: String, required: true }, // Subject area the quiz is related to
    questions: [questionSchema], // Array of questions
    totalPoints: { type: Number, default: 0 }, // Total points possible for the quiz
    passingScore: { type: Number, required: true }, // Score required to pass the quiz
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the quiz
    tags: [{ type: String }], // Tags for categorization (e.g., 'math', 'science', 'beginner')
    randomizeQuestions: { type: Boolean, default: false }, // Option to randomize questions
    isAdaptive: { type: Boolean, default: false }, // If true, quiz adjusts based on user performance
    recommendedResources: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Resource' // Reference to external resources for further learning
    }],
    createdAt: { type: Date, default: Date.now }, // When the quiz was created
    updatedAt: { type: Date, default: Date.now } // When the quiz was last updated
});

// Schema for tracking user quiz performance and feedback
const userQuizSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }, // The quiz taken
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who took the quiz
    score: { type: Number, required: true }, // User's score on the quiz
    completionTime: { type: Number }, // Time taken to complete the quiz in seconds
    timePerQuestion: [{ 
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, // Question answered
        timeTaken: { type: Number, required: true } // Time taken to answer this question
    }],
    answers: [{
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, // Question answered
        selectedOption: { type: Number, required: true }, // Index of the selected option
        isCorrect: { type: Boolean }, // Was the answer correct?
        feedback: { type: String }, // User feedback on the question (e.g., helpful, unclear)
    }],
    feedback: { type: String }, // Optional overall feedback from the user about the quiz
    suggestions: [{ type: String }], // Suggestions for quiz improvement from the user
    userPerformance: { 
        correctAnswers: { type: Number, default: 0 }, // Count of correct answers
        incorrectAnswers: { type: Number, default: 0 }, // Count of incorrect answers
        masteryLevel: { 
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'], // User mastery level determined by performance
            default: 'beginner' 
        }
    },
    createdAt: { type: Date, default: Date.now } // When the quiz was taken
});

// Models for Quiz and UserQuiz
const Quiz = mongoose.model('Quiz', quizSchema);
const UserQuiz = mongoose.model('UserQuiz', userQuizSchema);

module.exports = { Quiz, UserQuiz };
