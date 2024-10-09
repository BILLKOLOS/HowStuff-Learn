const mongoose = require('mongoose');
const { Schema } = mongoose;
const { USER_LEVELS } = require('../utils/aiUtils'); // Import USER_LEVELS

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { 
        type: String, required: true, unique: true, trim: true, lowercase: true,
        validate: {
            validator: function(v) { return /^\S+@\S+\.\S+$/.test(v); },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: { type: String, required: true, minlength: 6 },
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
    preferences: {
        notificationSettings: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
        },
        contentVisibility: { subjectPreferences: [{ type: String }] },
        languagePreferences: { type: String, default: 'en' },
    },
    // References to other models
    children: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    parent: { type: Schema.Types.ObjectId, ref: 'User' },
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
        enum: Object.values(USER_LEVELS),
        required: true,
    },
});

userSchema.pre('save', async function(next) {
    // Hash the password before saving
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
