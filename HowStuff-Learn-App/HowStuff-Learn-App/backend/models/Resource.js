const mongoose = require('mongoose');
const { Schema } = mongoose;

// Resource Schema Definition
const resourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
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
    type: {
        type: String,
        enum: ['article', 'video', 'guide', 'interactive'],
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
    // New fields for enhanced resource management
    tags: [{
        type: String, // Tags for categorizing resources
        trim: true,
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the author of the resource
    },
    rating: {
        type: Number, // User rating for the resource
        min: 0,
        max: 5,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false, // Flag for featured resources
    },
});

// Middleware to update `updatedAt` before saving
resourceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Resource model
const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
