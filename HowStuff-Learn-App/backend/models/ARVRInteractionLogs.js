const mongoose = require('mongoose');

const ARVRInteractionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'ARContent' || 'VRContent', required: true },
  contentType: { type: String, enum: ['AR', 'VR'], required: true },
  durationSpent: { type: Number, required: true }, // Time spent in session (minutes)
  interactionTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ARVRInteractionLog', ARVRInteractionLogSchema);
