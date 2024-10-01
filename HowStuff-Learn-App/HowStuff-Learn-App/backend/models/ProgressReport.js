const mongoose = require('mongoose');
const { Schema } = mongoose;

// Progress Report Schema Definition
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
            min: 0, // Minimum score
        },
        maxScore: {
            type: Number,
            required: true,
            min: 0, // Minimum max score
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
    comments: {
        type: String,
        trim: true, // Optional feedback or notes regarding the progress report
    },
    feedback: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model (teacher or peer)
            required: true,
        },
        comment: {
            type: String,
            trim: true, // Optional feedback comment
        },
        createdAt: {
            type: Date,
            default: Date.now, // Timestamp of the feedback
        },
    }],
    learningGoals: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningGoal', // Reference to the LearningGoal model
    }],
    attendance: [{
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            required: true,
        },
    }],
    skills: [{
        name: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        dateAcquired: {
            type: Date,
            default: Date.now,
        },
    }],
    progressHistory: [{
        overallProgress: {
            type: Number,
            min: 0,
            max: 100,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    }],
    resourcesUtilized: [{
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
                },
                message: props => `${props.value} is not a valid URL!`,
            },
        },
        dateAccessed: {
            type: Date,
            default: Date.now,
        },
    }],
    visualProgressData: [{
        date: {
            type: Date,
            required: true,
        },
        progressValue: {
            type: Number,
            min: 0,
            max: 100,
        },
    }],
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
