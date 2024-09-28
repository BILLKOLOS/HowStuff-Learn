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
});

// Middleware to update `updatedAt` before saving
resourceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
