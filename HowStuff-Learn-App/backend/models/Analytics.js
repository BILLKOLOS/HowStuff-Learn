const mongoose = require('mongoose');
const { Schema } = mongoose;

// Analytics Schema Definition
const analyticsSchema = new Schema({
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: 'VirtualLecture',
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create Analytics model
const Analytics = mongoose.model('Analytics', analyticsSchema);

// Export the Analytics model
module.exports = Analytics;
