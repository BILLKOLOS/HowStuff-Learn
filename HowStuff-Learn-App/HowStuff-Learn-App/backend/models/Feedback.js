const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user providing feedback
        required: true,
    },
    contentId: {
        type: Schema.Types.ObjectId,
        ref: 'Content', // Reference to the content being reviewed
        required: true,
    },
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecture', // Reference to the lecture (if applicable)
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5, // Maximum rating
    },
    comments: {
        type: String,
        trim: true,
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
feedbackSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

