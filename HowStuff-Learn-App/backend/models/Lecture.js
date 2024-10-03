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
        createdAt: {
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
    resources: [{
        type: String, // Links or titles to resources related to the lecture
    }],
    prerequisites: [{
        type: String, // List of prerequisites for attending the lecture
    }],
    isActive: {
        type: Boolean,
        default: true, // Indicates if the lecture is currently active
    },
    type: {
        type: String,
        enum: ['Live', 'Recorded', 'Guest Speaker'],
        required: true,
    },
    materials: [{
        title: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    questions: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        answered: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    followUps: [{
        description: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    }],
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification',
    }],
    attendance: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attendedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // New fields for AR/VR
    isAR: {
        type: Boolean,
        default: false, // Flag for AR-enabled lectures
    },
    isVR: {
        type: Boolean,
        default: false, // Flag for VR-enabled lectures
    }
});

// Middleware to update `updatedAt` before saving
lectureSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Lecture model
const Lecture = mongoose.model('Lecture', lectureSchema);

// Export the Lecture model
module.exports = Lecture;
