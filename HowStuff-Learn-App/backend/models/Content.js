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
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`,
        },
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
    averageRating: {
        type: Number, // Calculated average rating
        default: 0,
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
    prerequisiteContent: [{
        type: Schema.Types.ObjectId,
        ref: 'Content', // Reference to prerequisite content
    }],
    accessControl: {
        type: Map, // Key-value pairs to manage access per role
        of: Boolean,
    },
    progressTracking: {
        completed: { type: Boolean, default: false },
        inProgress: { type: Boolean, default: false },
    },
    updateHistory: [{
        date: { type: Date, default: Date.now },
        changes: { type: String }, // Description of changes made
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    language: {
        type: String,
        enum: ['en', 'es', 'fr', 'other'], // Supported languages
    },
    altText: {
        type: String, // Alternative text for media
    },
    slug: {
        type: String,
        unique: true, // Unique slug for SEO-friendly URLs
        required: true,
    },
});

// Middleware to update `updatedAt` before saving
contentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual method to calculate the average rating
contentSchema.methods.calculateAverageRating = function() {
    if (this.ratings.length > 0) {
        const total = this.ratings.reduce((acc, curr) => acc + curr, 0);
        this.averageRating = total / this.ratings.length;
    } else {
        this.averageRating = 0; // Default if no ratings exist
    }
};

// Virtual method to add a review
contentSchema.methods.addReview = function(review) {
    this.reviews.push(review);
};

// Slug generation before saving
contentSchema.pre('save', function(next) {
    this.slug = this.title.toLowerCase().replace(/\s+/g, '-').slice(0, 100); // Generate slug from title
    next();
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
