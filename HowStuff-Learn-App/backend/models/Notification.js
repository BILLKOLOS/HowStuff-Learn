const mongoose = require('mongoose');
const { Schema } = mongoose;

// Notification Schema Definition
const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['lecture', 'feedback', 'poll', 'general'],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create Notification model
const Notification = mongoose.model('Notification', notificationSchema);

// Export the Notification model
module.exports = Notification;
