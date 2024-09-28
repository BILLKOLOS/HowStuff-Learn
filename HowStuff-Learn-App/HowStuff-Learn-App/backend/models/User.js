const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

// User Schema Definition
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
                return /^\S+@\S+\.\S+$/.test(v); // Basic email regex validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    role: {
        type: String,
        enum: ['student', 'parent', 'educator', 'admin'], // Added 'admin' role for better management
        default: 'student',
    },
    profilePicture: {
        type: String,
        default: 'defaultProfilePic.png', // Default profile picture path
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to child accounts
    }],
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for account creation
    },
    searchHistory: [{
        query: { type: String, required: true },
        results: [{ type: String }], // List of resource links
        createdAt: { type: Date, default: Date.now }
    }],
    progress: [{
        assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' }, // Reference to assessments
        score: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    goals: [{
        goalDescription: { type: String, required: true },
        targetDate: { type: Date, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    reflections: [{
        moduleId: { type: Schema.Types.ObjectId, ref: 'Module' }, // Reference to learning modules
        reflectionText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    // Additional fields for enhanced user profiles
    phoneNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\+?\d{10,15}$/.test(v); // Basic phone number regex
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        trim: true,
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next(); // Skip hashing if the password hasn't been modified
    }
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // Compare passwords
};

// Create User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
