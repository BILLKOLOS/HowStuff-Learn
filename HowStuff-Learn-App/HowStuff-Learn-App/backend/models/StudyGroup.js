const mongoose = require('mongoose');
const { Schema } = mongoose;

// Study Group Schema Definition
const studyGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (creator of the study group)
        required: true,
    },
    subject: {
        type: String,
        required: true, // Subject or topic of the study group
        enum: ['math', 'science', 'language', 'arts', 'history', 'technology', 'other'],
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
            type: String, // Optional field for meeting notes
            trim: true,
        },
        duration: {
            type: Number, // Duration of the meeting in minutes
            min: 0,
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
    isActive: {
        type: Boolean,
        default: true, // To track if the study group is active
    },
});

// Middleware to update `updatedAt` before saving
studyGroupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to validate members
studyGroupSchema.pre('save', function(next) {
    if (this.members.length === 0) {
        return next(new Error('A study group must have at least one member.'));
    }
    next();
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;
