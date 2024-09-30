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
});

module.exports = mongoose.model('Mentorship', MentorshipSchema);
