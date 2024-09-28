const mongoose = require('mongoose');
const { Schema } = mongoose;

// Virtual Lecture Schema Definition
const virtualLectureSchema = new Schema({
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
        required: true, // When the lecture is scheduled to take place
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user hosting the lecture
        required: true,
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // References to users participating in the lecture
    }],
    resources: [{
        type: Schema.Types.ObjectId,
        ref: 'Resource', // References to resources associated with the lecture
    }],
    meetingLink: {
        type: String,
        required: true, // Link to the virtual meeting platform
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        },
    },
    polls: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        responses: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Users who responded
    }],
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the lecture was created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the lecture was last updated
    },
});

// Middleware to update `updatedAt` before saving
virtualLectureSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Virtual Lecture model
const VirtualLecture = mongoose.model('VirtualLecture', virtualLectureSchema);

// Export the Virtual Lecture model
module.exports = VirtualLecture;
