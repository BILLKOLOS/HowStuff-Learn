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
        enum: ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'EMAIL_CHANGE', 'ACCOUNT_LOCKED'],
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
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
