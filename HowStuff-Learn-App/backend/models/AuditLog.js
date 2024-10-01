const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'EMAIL_CHANGE', 'ACCOUNT_LOCKED', 'CONTENT_VIEWED', 'COURSE_ENROLLED', 'CERTIFICATE_ISSUED', 'BADGE_EARNED', 'ASSESSMENT_SUBMITTED'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['SUCCESS', 'FAILURE'],
    },
    userAgent: {
        type: String, // Information about the user's browser or device
    },
    location: {
        city: { type: String },
        country: { type: String },
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a related resource (Content, Course, etc.)
        refPath: 'entityModel', // Dynamic reference to related models
    },
    entityModel: {
        type: String,
        enum: ['Content', 'Course', 'Assessment', 'LearningModule'], // Related entity model options
    },
    sessionId: {
        type: String, // Unique ID for the user session
    },
    description: {
        type: String, // Additional information about the action
    },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
