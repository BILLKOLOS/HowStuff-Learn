const mongoose = require('mongoose');

// Learning Goal Schema Definition
const LearningGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // Title of the goal
  goalDescription: { type: String, required: true }, // Brief description of the goal
  targetCompletionDate: { type: Date, required: true }, // Date by which the goal should be achieved
  progress: { type: Number, default: 0 },  // Percentage completion
  isAchieved: { type: Boolean, default: false }, // Indicates if the goal has been achieved
  relatedModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningModule', // Reference to associated learning modules
  }],
  progressLogs: [{
      date: { type: Date, default: Date.now },
      progress: { type: Number, required: true }, // Progress made on this date
  }],
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the goal was created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for when the goal was last updated
});

// Middleware to update `updatedAt` before saving
LearningGoalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LearningGoal', LearningGoalSchema);
