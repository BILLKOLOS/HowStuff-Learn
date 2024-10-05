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
        enum: ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'EMAIL_CHANGE', 'ACCOUNT_LOCKED', 'CONTENT_VIEWED', 'COURSE_ENROLLED', 'CERTIFICATE_ISSUED', 'BADGE_EARNED', 'ASSESSMENT_SUBMITTED', 'CUSTOM_ACTION'],
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
        type: String,
    },
    location: {
        city: { type: String },
        country: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entityModel',
    },
    entityModel: {
        type: String,
        enum: ['Content', 'Course', 'Assessment', 'LearningModule'],
    },
    sessionId: {
        type: String,
    },
    description: {
        type: String,
    },
    errorCode: {
        type: String,
    },
    userRole: {
        type: String,
    },
    rateLimitCount: {
        type: Number,
        default: 0,
    },
    sessionDuration: { // New field for session duration
        type: Number, // Duration in minutes
    },
    actionSource: { // New field to capture the source of the action
        type: String,
        enum: ['Web', 'Mobile App', 'API'],
    },
    userFeedback: { // New field for user feedback
        type: String,
    },
    riskScore: { // New field for assessing risk levels
        type: Number,
    },
    notificationSent: { // New field to track notifications related to actions
        type: Boolean,
        default: false,
    },
    customTags: [{ // New field for custom tags
        type: String,
    }],
});

// Create AuditLog model
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
