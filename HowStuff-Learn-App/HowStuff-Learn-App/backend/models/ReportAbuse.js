const mongoose = require('mongoose');

const ReportAbuseSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  forumPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' }
});

module.exports = mongoose.model('ReportAbuse', ReportAbuseSchema);
