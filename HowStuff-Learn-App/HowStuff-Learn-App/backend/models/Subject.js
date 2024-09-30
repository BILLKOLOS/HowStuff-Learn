const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    gradeLevel: {
        type: String, // Could be 'Kindergarten', 'High School', 'Undergraduate', etc.
        required: true,
    },
    tags: [String], // Helps in categorization
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExternalResource' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subject', SubjectSchema);
