const mongoose = require('mongoose');

const AIRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedTopics: [{ type: String }],
  recommendedQuizzes: [{ type: String }],
  recommendedProjects: [{ type: String }],
  recommendedModules: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRecommendation', AIRecommendationSchema);
