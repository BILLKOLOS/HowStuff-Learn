const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const { USER_LEVELS } = require('../utils/aiUtils'); // Ensure USER_LEVELS is defined properly

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) { return /^\S+@\S+\.\S+$/.test(v); },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function(v) { return /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/.test(v); },
            message: 'Password must be at least 6 characters long and contain at least one digit and one special character.'
        }
    },
    role: { type: String, enum: ['student', 'parent', 'educator', 'admin'], default: 'student' },
    profilePicture: { type: String, default: 'defaultProfilePic.png' },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) { return /^\+?\d{10,15}$/.test(v); },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    // New Preferences Section (ageGroup, preferredSubjects, learningGoals)
    preferences: {
        notificationSettings: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },
        contentVisibility: { subjectPreferences: [{ type: String }] },
        languagePreferences: { type: String, default: 'en' },
        ageGroup: { type: String, enum: ['child', 'teen', 'adult'], required: false }, // Age group preference
        preferredSubjects: [{ type: String }], // Array of subjects user is interested in
        learningGoals: { type: String }, // Learning goals description
    },
    // References to other models
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parent: { type: Schema.Types.ObjectId, ref: 'User' }, // Fixed bracket
    enrolledModules: [{ type: Schema.Types.ObjectId, ref: 'LearningModule' }],
    completedLabs: [{ type: Schema.Types.ObjectId, ref: 'VirtualLab' }],
    assessmentHistory: [{ type: Schema.Types.ObjectId, ref: 'Assessment' }],
    learningGoals: [{ type: Schema.Types.ObjectId, ref: 'LearningGoal' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    activityLog: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    feedback: [{ type: Schema.Types.ObjectId, ref: 'Feedback' }],
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    userLevel: {
        type: String,
        enum: Object.values(USER_LEVELS), // Ensure USER_LEVELS are properly defined elsewhere
        required: true, // This ensures userLevel must be provided
    },
});

// Pre-save hook to hash passwords
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (error) {
            return next(error); // Pass error to the next middleware
        }
    }
    next();
});

// Create the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
