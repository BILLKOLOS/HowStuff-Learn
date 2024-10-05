const mongoose = require('mongoose');
const { Schema } = mongoose;

// URL validation function
const isValidUrl = (url) => {
    const regex = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/;
    return regex.test(url);
};

// Activity Schema Definition
const activitySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    suggestedAgeGroup: {
        type: String,
        enum: ['0-2', '3-5', '6-8', '9-12', '13+'],
        required: true,
    },
    materialsNeeded: {
        type: [String], // Array of materials needed for the activity
        default: [],
        validate: {
            validator: (materials) => materials.every(material => typeof material === 'string'),
            message: 'Each material must be a string',
        },
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
        min: 1,
    },
    learningObjectives: {
        type: [String], // Array of learning objectives for the activity
        default: [],
    },
    type: {
        type: String,
        required: true,
        enum: ['individual', 'group', 'interactive'],
    },
    skillLevel: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    reward: {
        type: Schema.Types.ObjectId,
        ref: 'Badge', // Badge or reward earned upon activity completion
    },
    completionStatus: {
        type: String,
        required: true,
        enum: ['not started', 'in progress', 'completed'],
        default: 'not started',
    },
    completedAt: {
        type: Date,
    },
    relatedLearningPath: {
        type: Schema.Types.ObjectId,
        ref: 'LearningPath', // Reference to related learning path
    },
    studyGroup: {
        type: Schema.Types.ObjectId,
        ref: 'StudyGroup', // Reference to a study group
    },
    media: [{
        type: String, // URLs to media resources
        validate: {
            validator: (mediaUrls) => mediaUrls.every(url => isValidUrl(url)),
            message: 'Each media URL must be valid',
        },
    }],
    relatedAssessment: {
        type: Schema.Types.ObjectId,
        ref: 'Assessment', // Link to related assessment
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
activitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static methods for searching and filtering
activitySchema.statics.findByFilters = async function(filters) {
    const query = {};
    
    // Filter by suggested age group
    if (filters.suggestedAgeGroup) {
        query.suggestedAgeGroup = filters.suggestedAgeGroup;
    }

    // Filter by skill level
    if (filters.skillLevel) {
        query.skillLevel = filters.skillLevel;
    }

    // Filter by type
    if (filters.type) {
        query.type = filters.type;
    }

    return this.find(query);
};

// Export the Activity model
const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
