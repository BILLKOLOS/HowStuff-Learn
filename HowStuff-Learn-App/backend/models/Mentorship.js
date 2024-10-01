const mongoose = require('mongoose');

const MentorshipSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentorshipGoal: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
    },
    progress: {
        type: String,
        default: 'In Progress',
    },
    notes: {
        type: String,
    },
    meetingSchedule: [{
        date: {
            type: Date,
            required: true,
        },
        agenda: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
    }],
    feedback: {
        type: String,
    },
    milestones: [{
        milestone: {
            type: String,
            required: true,
        },
        achieved: {
            type: Boolean,
            default: false,
        },
        dateAchieved: {
            type: Date,
        },
    }],
    resources: [{
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        dateShared: {
            type: Date,
            default: Date.now,
        },
    }],
    statusUpdates: [{
        update: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
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
MentorshipSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Mentorship', MentorshipSchema);
