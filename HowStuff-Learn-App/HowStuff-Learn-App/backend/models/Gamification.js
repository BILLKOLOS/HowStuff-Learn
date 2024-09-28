const mongoose = require('mongoose');
const { Schema } = mongoose;

// Achievement Schema Definition
const achievementSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
        min: 0, // Points awarded for achieving this milestone
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// User Gamification Schema Definition
const userGamificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    achievements: [achievementSchema], // List of achievements the user has earned
    totalPoints: {
        type: Number,
        default: 0, // Total points accumulated by the user
    },
    level: {
        type: Number,
        default: 1, // User's current level
    },
    progress: [{
        moduleId: {
            type: Schema.Types.ObjectId,
            ref: 'Module', // Reference to learning modules
            required: true,
        },
        completed: {
            type: Boolean,
            default: false, // Track if the module has been completed
        },
        pointsEarned: {
            type: Number,
            default: 0, // Points earned for completing this module
        },
        createdAt: {
            type: Date,
            default: Date.now,
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
userGamificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create User Gamification model
const UserGamification = mongoose.model('UserGamification', userGamificationSchema);

// Export the User Gamification model
module.exports = UserGamification;
