const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
  },
  badgeName: { 
      type: String, 
      required: true 
  },
  description: { 
      type: String 
  },
  badgeType: {
      type: String,
      enum: ['achievement', 'participation', 'skill', 'challenge'], // Type options
      required: true,
  },
  criteria: {
      type: String, // Description of the criteria to earn the badge
      required: true,
  },
  criteriaType: {
      type: String,
      enum: ['points', 'assessment', 'participation'], // Different types of criteria
  },
  imageUrl: {
      type: String, // URL to the badge image
      required: true,
  },
  status: {
      type: String,
      enum: ['active', 'revoked', 'pending'], // Status options
      default: 'active', // Default status
  },
  dateEarned: {
      type: Date, // Actual date when the badge was earned
  },
  dateRevoked: {
      type: Date, // Date when the badge was revoked, if applicable
  },
  level: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'], // Level options
  },
  tags: [{
      type: String, // Array of tags for the badge
      trim: true,
  }],
  awardedBy: {
      type: String, // Name of the institution or system that awarded the badge
      required: true,
  },
  earnedAt: { 
      type: Date, 
      default: Date.now 
  },
  userFeedback: {
      type: String, // User feedback regarding the badge
  },
  history: [{
      date: { type: Date, default: Date.now },
      changeDescription: { type: String },
  }],
  expirationDate: {
      type: Date, // Expiration date of the badge, if applicable
  },
  relatedLearningModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningModule', // Reference to related learning modules
  }],
  shareable: {
      type: Boolean,
      default: true, // Whether the badge can be shared
  },
  approvalStatus: {
      type: String,
      enum: ['approved', 'pending', 'rejected'], // Badge approval status
      default: 'approved',
  },
  associatedEvents: [{
      type: String, // Events linked to the badge
  }],
});

// Export the Badge model
module.exports = mongoose.model('Badge', BadgeSchema);
