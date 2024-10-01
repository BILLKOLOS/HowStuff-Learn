const mongoose = require('mongoose');

const AIRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recommendedTopics: [{ type: String }], // Topics AI suggests based on learning goals and performance
  recommendedQuizzes: [{ type: String }], // Quizzes recommended to the user
  recommendedProjects: [{ type: String }], // AI-suggested projects
  recommendedModules: [{ type: String }], // Modules recommended for the user's learning
  personalizedLearningGoals: [{ type: String }], // AI-generated learning goals
  recommendedLearningPath: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath' }, // AI-suggested learning path
  engagementBasedRecommendations: [{ type: String }], // Recommendations based on engagement
  skillImprovementSuggestions: [{ type: String }], // Suggestions for improving specific skills
  recommendedStudyGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyGroup' }], // Study groups the user should join
  aiConfidenceScore: { type: Number, min: 0, max: 100 }, // AI confidence score for recommendations
  feedback: { type: String, enum: ['helpful', 'not helpful'] }, // User feedback on recommendations
  contextBasedRecommendations: [{ type: String }], // Recommendations based on user's real-time context
  lastUpdated: { type: Date, default: Date.now } // Timestamp for the last AI recommendation update
});

module.exports = mongoose.model('AIRecommendation', AIRecommendationSchema);
