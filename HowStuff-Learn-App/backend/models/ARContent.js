const mongoose = require('mongoose');

const ARContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  resourceUrl: { type: String, required: true },
  level: { type: String }, // Difficulty level
  duration: { type: Number }, // Duration in minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ARContent', ARContentSchema);
