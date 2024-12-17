const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevels: { type: [String], required: true }, // Example: ['Grade 5', 'Grade 6']
    topics: { type: [String], required: true }, // Example: ['Physics', 'Chemistry']
    isAR: { type: Boolean, default: false },
    isVR: { type: Boolean, default: false },
    resources: { type: [String] }, // URLs or resource IDs
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Simulation', SimulationSchema);
