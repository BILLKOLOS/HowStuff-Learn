const mongoose = require('mongoose');
const { Schema } = mongoose;

// Lecture Schema Definition
const lectureSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    scheduledTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    lecturer: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who is the lecturer
        required: true,
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to users attending the lecture
    }],
    recordingLink: {
        type: String, // URL to the recorded lecture
    },
    feedback: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the user providing feedback
            required: true,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            trim: true,
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
lectureSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Lecture = mongoose.model('Lecture', lectureSchema);

module.exports = Lecture;
