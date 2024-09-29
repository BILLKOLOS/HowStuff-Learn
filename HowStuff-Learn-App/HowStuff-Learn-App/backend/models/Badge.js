const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeName: { type: String, required: true },
  description: { type: String },
  earnedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', BadgeSchema);
