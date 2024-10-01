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
});

module.exports = mongoose.model('Badge', BadgeSchema);
