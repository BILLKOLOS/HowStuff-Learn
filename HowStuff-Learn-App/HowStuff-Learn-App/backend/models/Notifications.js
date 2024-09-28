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
    lectureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture' // Optional reference to a lecture
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment' // Optional reference to an assignment
    }
});

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
