const mongoose = require('mongoose');

const ReportAbuseSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    forumPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
    evidence: [{
        type: String, // URL to the evidence (e.g., images or documents)
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        },
    }],
    description: { type: String, required: true }, // Detailed description of the abuse
    category: {
        type: String,
        enum: ['Harassment', 'Spam', 'Misinformation', 'Inappropriate Content'],
        required: true,
    },
    actionsTaken: [{
        action: { type: String }, // Description of the action taken
        date: { type: Date, default: Date.now }, // Date when the action was taken
    }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Moderator assigned to the report
    resolutionComments: { type: String }, // Comments made by the moderator during resolution
    resolvedAt: { type: Date }, // Date when the report was resolved
});

module.exports = mongoose.model('ReportAbuse', ReportAbuseSchema);
