const mongoose = require('mongoose');
const { Schema } = mongoose;

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

