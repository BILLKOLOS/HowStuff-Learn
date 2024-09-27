const mongoose = require('mongoose');
const { Schema } = mongoose;

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
});

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
    questions: [questionSchema],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the assessment
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
assessmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;

