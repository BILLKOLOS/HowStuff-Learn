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
studyGroupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;
