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
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExternalResource' }], // Reference to external resources
    learningGoals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningGoal' }], // Reference to learning goals
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }], // Reference to related activities
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }], // Reference to assessments tied to the subject
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: { // Track updates to the subject
        type: Date,
        default: Date.now,
    },
});

SubjectSchema.pre('save', function (next) {
    // Automatically set updatedAt to the current date before saving
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Subject', SubjectSchema);
