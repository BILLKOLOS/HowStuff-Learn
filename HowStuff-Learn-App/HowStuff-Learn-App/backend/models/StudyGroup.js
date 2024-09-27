const mongoose = require('mongoose');
const { Schema } = mongoose;

const studyGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (creator of the study group)
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
studyGroupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;

