const mongoose = require('mongoose');
const { Schema } = mongoose;

// Attendance Schema Definition
const attendanceSchema = new Schema({
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
    attended: {
        type: Boolean,
        default: false,
    },
    duration: {
        type: Number, // Duration in minutes
        default: 0,
    },
    participationType: {
        type: String,
        enum: ['joined early', 'fully attended', 'left early'],
        default: 'fully attended',
    },
    engagementActivities: [{
        type: String, // Activities such as "asked question", "participated in poll"
    }],
    feedback: {
        type: String, // Optional feedback from the user about the lecture
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    // New fields for enhanced tracking
    engagementMetrics: {
        scrollDepth: {
            type: Number, // Percentage of content scrolled through
            default: 0,
        },
        interactions: {
            questionsAsked: {
                type: Number,
                default: 0,
            },
            pollsParticipated: {
                type: Number,
                default: 0,
            },
        },
    },
    // Gamification elements
    pointsEarned: {
        type: Number,
        default: 0, // Points earned based on engagement and attendance
    },
    badges: [{
        type: Schema.Types.ObjectId,
        ref: 'Badge', // Reference to Badge model for awarded badges
    }],
});

// Create Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Export the Attendance model
module.exports = Attendance;
