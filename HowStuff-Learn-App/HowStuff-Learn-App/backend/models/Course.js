const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule' }],
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
    level: {
        type: String, // e.g., 'Undergraduate', 'Master's', 'PhD'
        required: true,
    },
    duration: {
        type: String, // e.g., '3 months'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', CourseSchema);
