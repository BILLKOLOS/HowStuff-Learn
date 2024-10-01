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

// Badge Schema Definition
const badgeSchema = new Schema({
    title: { type: String, required: true }, // Badge title
    description: { type: String, required: true }, // Badge description
    dateEarned: { type: Date, default: Date.now }, // When the badge was earned
});

// User Gamification Schema Definition
const userGamificationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    achievements: [achievementSchema], // List of achievements the user has earned
    badges: [badgeSchema], // List of badges the user has earned
    totalPoints: {
        type: Number,
        default: 0, // Total points accumulated by the user
    },
    level: {
        type: Number,
        default: 1, // User's current level
    },
    xp: {
        type: Number,
        default: 0, // Total experience points accumulated by the user
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
    milestones: [{
        title: { type: String, required: true }, // Milestone title
        description: { type: String, required: true }, // Milestone description
        dateAchieved: { type: Date, default: Date.now }, // When the milestone was achieved
    }],
    rewards: [{
        title: { type: String, required: true }, // Reward title
        description: { type: String, required: true }, // Reward description
        pointsRequired: { type: Number, required: true }, // Points needed to redeem the reward
    }],
    activityHistory: [{
        activityType: { type: String, required: true }, // Type of activity
        points: { type: Number, required: true }, // Points earned from this activity
        date: { type: Date, default: Date.now }, // When the activity took place
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
