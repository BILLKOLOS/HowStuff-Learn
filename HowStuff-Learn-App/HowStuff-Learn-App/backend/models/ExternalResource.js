const mongoose = require('mongoose');
const { Schema } = mongoose;

// External Resource Schema Definition
const externalResourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends
    },
    description: {
        type: String,
        required: true, // Brief description of the resource
    },
    url: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        },
    },
    source: {
        type: String,
        required: true, // Source of the external resource (e.g., Wikipedia, Khan Academy)
    },
    tags: [{
        type: String, // Array of tags for categorization (e.g., ["science", "math"])
    }],
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the resource was added
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the resource was last updated
    },
    // New field for user ratings or feedback on the resource
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3, // Default rating
    },
    resourceType: {
        type: String,
        required: true,
        enum: ['video', 'article', 'tutorial', 'book'], // Define resource types
    },
    author: {
        type: String,
        required: true, // Author/creator name
    },
    usageInstructions: {
        type: String,
        trim: true, // Optional usage instructions
    },
    learningPathIds: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningPath', // Reference to LearningPath model
    }],
    ratingCount: {
        type: Number,
        default: 0, // Count of ratings
    },
    feedback: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
        },
        comment: {
            type: String,
            trim: true, // User comment
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    relatedResources: [{
        type: Schema.Types.ObjectId,
        ref: 'ExternalResource', // Reference to ExternalResource model
    }],
    accessRestrictions: {
        type: String,
        enum: ['free', 'subscription', 'institutional'], // Access types
    },
});

// Middleware to update `updatedAt` before saving
externalResourceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create External Resource model
const ExternalResource = mongoose.model('ExternalResource', externalResourceSchema);

// Export the External Resource model
module.exports = ExternalResource;
