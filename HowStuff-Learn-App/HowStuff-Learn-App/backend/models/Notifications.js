const mongoose = require('mongoose');

// Define the Notification schema
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the User model
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Lecture', 'Assignment', 'General', 'Reminder'], // Types of notifications
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false // Indicates if the notification has been read
    },
    acknowledged: {
        type: Boolean,
        default: false // Indicates if the notification has been acknowledged
    },
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture' // Optional reference to a lecture
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment' // Optional reference to an assignment
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium', // Default priority is medium
    },
    targetAudience: {
        type: String,
        enum: ['Parent', 'Student', 'Both'],
        required: true,
    },
    resourceLink: {
        type: String, // Optional link to additional resources
    },
    expiresAt: {
        type: Date, // Expiration date for the notification
    },
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
