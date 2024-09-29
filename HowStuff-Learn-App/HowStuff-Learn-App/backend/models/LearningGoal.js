const mongoose = require('mongoose');

const LearningGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goalDescription: { type: String, required: true },
  targetCompletionDate: { type: Date, required: true },
  progress: { type: Number, default: 0 },  // Percentage completion
  isAchieved: { type: Boolean, default: false }
});

module.exports = mongoose.model('LearningGoal', LearningGoalSchema);
