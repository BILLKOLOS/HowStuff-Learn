const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String, // e.g., 'Technical', 'Communication'
        required: true,
    },
    level: {
        type: String, // Beginner, Intermediate, Advanced
        required: true,
    },
    requiredForCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Skill', SkillSchema);
