const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;
const { USER_LEVELS } = require('../utils/aiUtils'); // Import USER_LEVELS from aiUtils

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['student', 'parent', 'educator', 'admin'],
        default: 'student',
    },
    profilePicture: {
        type: String,
        default: 'defaultProfilePic.png',
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    searchHistory: [{
        query: { type: String, required: true },
        results: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
    }],
    progress: [{
        assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
        score: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    goals: [{
        goalDescription: { type: String, required: true },
        targetDate: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    reflections: [{
        moduleId: { type: Schema.Types.ObjectId, ref: 'Module' },
        reflectionText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\+?\d{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        trim: true,
    },
    lastLogin: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    notifications: [{
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    profileCompleteness: {
        type: Number,
        default: 0,
    },
    preferences: {
        notificationSettings: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },
        contentVisibility: {
            subjectPreferences: [{ type: String }],
        },
    },
    twoFactorAuth: {
        isEnabled: { type: Boolean, default: false },
        phoneNumber: {
            type: String,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\+?\d{10,15}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number for 2FA!`
            }
        },
    },
    accountRecovery: {
        securityQuestions: [{
            question: { type: String, required: true },
            answer: { type: String, required: true },
        }],
        alternateEmail: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^\S+@\S+\.\S+$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
    },
    activityLog: [{
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],
    enrolledModules: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningModule'
    }],
    completedLabs: [{ // New field for completed labs
        type: Schema.Types.ObjectId,
        ref: 'VirtualLab'
    }],
    badges: [{ // New field for user badges
        badgeName: { type: String, required: true },
        dateAwarded: { type: Date, default: Date.now }
    }],
    userLevel: { // User level
        type: String,
        enum: Object.values(USER_LEVELS),
        required: true,
    },
    learningHistory: [{
        contentId: { type: Schema.Types.ObjectId, ref: 'Content' },
        completedAt: { type: Date, default: Date.now },
        score: { type: Number },
        interactions: [{
            type: {
                type: String,
                enum: ['view', 'comment', 'like', 'share'],
                required: true
            },
            timestamp: { type: Date, default: Date.now }
        }],
    }],
});

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
