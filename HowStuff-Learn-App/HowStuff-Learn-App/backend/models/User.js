const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

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
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['student', 'parent', 'educator'],
        default: 'student',
    },
    profilePicture: {
        type: String,
        default: 'defaultProfilePic.png', // path to default profile picture
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to child accounts
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    searchHistory: [{
        query: { type: String, required: true },
        results: [{ type: String }], // List of resource links
        createdAt: { type: Date, default: Date.now }
    }]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
