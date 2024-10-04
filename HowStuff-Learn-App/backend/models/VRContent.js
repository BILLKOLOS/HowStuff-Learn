const mongoose = require('mongoose');

const VRContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  vrEnvironmentUrl: { type: String, required: true },
  duration: { type: Number }, // Duration in minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VRContent', VRContentSchema);
