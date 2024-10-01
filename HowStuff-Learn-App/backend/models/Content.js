const mongoose = require('mongoose');
const { Schema } = mongoose;

// Content Schema Definition
const contentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['math', 'science', 'language', 'arts', 'history', 'technology', 'other'],
    },
    tags: [{
        type: String,
        trim: true,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the content
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true, // URL to the educational material (video, article, etc.)
    },
    type: {
        type: String,
        required: true,
        enum: ['video', 'article', 'interactive', 'quiz'], // Added type of content
    },
    relatedTopics: [{
        type: String, // Topics that this content relates to (e.g., "Airplanes", "Renewable Energy")
    }],
    difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'], // Difficulty levels
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    ratings: {
        type: [Number], // Array to store user ratings
        default: [],
    },
    reviews: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        comment: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    isFeatured: {
        type: Boolean,
        default: false, // Indicates if the content is featured
    },
    accessLevel: {
        type: String,
        enum: ['free', 'paid'], // Access options
        required: true,
    },
    source: {
        type: String,
        trim: true,
    },
    externalLinks: [{
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        },
    }],
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
contentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
