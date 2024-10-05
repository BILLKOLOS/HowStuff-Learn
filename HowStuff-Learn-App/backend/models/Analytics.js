const mongoose = require('mongoose');
const { Schema } = mongoose;

// Analytics Schema Definition
const analyticsSchema = new Schema({
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: 'VirtualLecture',
        required: true,
        index: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 1,
        max: 5,
    },
    engagedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    engagementMetrics: {
        totalQuestionsAsked: {
            type: Number,
            default: 0,
        },
        totalPollsParticipated: {
            type: Number,
            default: 0,
        },
    },
    historicalData: [{
        date: {
            type: Date,
            default: Date.now,
        },
        averageRating: {
            type: Number,
            min: 1,
            max: 5,
        },
        views: {
            type: Number,
        },
    }],
    retentionPolicy: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    changeLog: [{
        date: {
            type: Date,
            default: Date.now,
        },
        changeType: String,
        changedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        changes: Object,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Pre-save middleware to update historical data
analyticsSchema.pre('save', function(next) {
    if (this.isModified('averageRating')) {
        this.historicalData.push({
            date: Date.now(),
            averageRating: this.averageRating,
            views: this.views,
        });
    }
    next();
});

// Create Analytics model
const Analytics = mongoose.model('Analytics', analyticsSchema);

// Export the Analytics model
module.exports = Analytics;
