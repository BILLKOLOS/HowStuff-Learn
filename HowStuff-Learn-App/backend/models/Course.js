const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule' }],
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
    level: {
        type: String,
        required: true,
        enum: ['Undergraduate', "Master's", 'PhD', 'Certificate'],
    },
    duration: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    enrollmentCapacity: {
        type: Number,
        default: 30,
    },
    currentEnrollment: {
        type: Number,
        default: 0,
    },
    enrollmentDeadline: {
        type: Date,
    },
    format: {
        type: String,
        enum: ['online', 'offline', 'hybrid', 'microlearning', 'workshop'],
        required: true,
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    ratings: {
        type: [Number],
        default: [],
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    featuredImage: {
        type: String,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        },
    },
    tags: [{
        type: String,
        trim: true,
    }],
    syllabus: {
        type: String,
    },
    certification: {
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    communityEngagement: {
        type: Boolean,
        default: false,
    },
    updateHistory: [{
        date: { type: Date, default: Date.now },
        changes: { type: String },
    }],
    learningOutcomes: [{
        type: String,
        required: true,
    }],
    language: {
        type: String,
        required: true,
    },
    courseDetails: {
        type: String,
    },
    groupDiscount: {
        type: Number,
        default: 0,
    },
    targetAudience: {
        type: String,
    },
    prerequisiteKnowledge: {
        type: String,
    },
    instructorSocialLinks: [{
        platform: { type: String },
        url: { type: String, validate: {
            validator: function(v) {
                return /^https?:\/\/.+/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        }},
    }],
    completionRate: {
        type: Number,
        default: 0,
    },
    additionalResources: [{
        title: { type: String },
        url: { type: String, validate: {
            validator: function(v) {
                return /^https?:\/\/.+/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        }},
    }],
    affiliateLinks: [{
        platform: { type: String },
        url: { type: String, validate: {
            validator: function(v) {
                return /^https?:\/\/.+/i.test(v);
            },
            message: props => `${props.value} is not a valid URL!`,
        }},
    }],
});

// Middleware to update `averageRating` before saving
CourseSchema.methods.calculateAverageRating = function() {
    if (this.ratings.length > 0) {
        const total = this.ratings.reduce((acc, curr) => acc + curr, 0);
        this.averageRating = total / this.ratings.length;
    } else {
        this.averageRating = 0; 
    }
};

// Middleware to track enrollment
CourseSchema.methods.trackEnrollment = function() {
    this.currentEnrollment += 1;
};

// Middleware to update `updatedAt` before saving
CourseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Course', CourseSchema);
