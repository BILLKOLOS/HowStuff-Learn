const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Nodemailer setup for notifications
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_GMAIL_USERNAME', // Your email address
        pass: 'YOUR_GMAIL_APP_PASSWORD', // Your email app password
    },
});

// Skill Schema Definition
const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures each skill has a unique name
    },
    description: {
        type: String,
    },
    category: {
        type: String, // e.g., 'Technical', 'Communication'
        required: true,
        enum: ['Technical', 'Communication', 'Management', 'Creative'], // Example categories
    },
    level: {
        type: String, // Beginner, Intermediate, Advanced
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced'], // Example skill levels
    },
    requiredForCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users assigned to the skill
    progress: {
        type: Number, // Percentage (0-100) indicating proficiency level
        min: 0,
        max: 100,
    },
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }], // Learning resources
    assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }], // Related assessments
    tags: [{ type: String }], // Tags for categorization
    skillCreatedAt: {
        type: Date,
        default: Date.now,
    },
    skillUpdatedAt: {
        type: Date,
        default: Date.now,
    },
    feedback: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
    }],
    learningPaths: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath' }],
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
SkillSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Method to notify users about skill changes
SkillSchema.methods.notifyUsers = async function(action) {
    // Assuming you have a way to get users to notify
    const User = require('./User'); // Adjust path according to your project structure
    const users = await User.find({}); // Get all users or filter as necessary

    users.forEach(user => {
        const mailOptions = {
            from: 'YOUR_GMAIL_USERNAME',
            to: user.email, // Assuming User model has an email field
            subject: `Skill ${action}: ${this.name}`,
            text: `The skill '${this.name}' has been ${action}. Description: ${this.description || 'N/A'}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
    });
};

// Instance methods for creating and updating skills
SkillSchema.methods.createSkill = async function() {
    await this.save();
    await this.notifyUsers('created');
};

SkillSchema.methods.updateSkill = async function() {
    await this.save();
    await this.notifyUsers('updated');
};

// Indexing for better performance
SkillSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model('Skill', SkillSchema);
