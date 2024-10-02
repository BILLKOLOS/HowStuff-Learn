const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Engagement Schema Definition
const userEngagementSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: 'VirtualLecture',
        required: true,
    },
    questionsAsked: {
        type: Number,
        default: 0,
    },
    pollsParticipated: {
        type: Number,
        default: 0,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Create User Engagement model
const UserEngagement = mongoose.model('UserEngagement', userEngagementSchema);

// Export the User Engagement model
module.exports = UserEngagement;
