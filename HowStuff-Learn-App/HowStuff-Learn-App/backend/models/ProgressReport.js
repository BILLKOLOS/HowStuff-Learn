const mongoose = require('mongoose');
const { Schema } = mongoose;

const progressReportSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (student)
        required: true,
    },
    assessments: [{
        assessmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Assessment', // Reference to the Assessment model
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        maxScore: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    learningModules: [{
        moduleId: {
            type: Schema.Types.ObjectId,
            ref: 'LearningModule', // Reference to the LearningModule model
            required: true,
        },
        completionStatus: {
            type: Boolean,
            default: false,
        },
        dateCompleted: {
            type: Date,
        },
    }],
    overallProgress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` before saving
progressReportSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ProgressReport = mongoose.model('ProgressReport', progressReportSchema);

module.exports = ProgressReport;

