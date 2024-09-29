const mongoose = require('mongoose');

const ParentalTrackingSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  progressReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProgressReport' }],
  notifications: [{
    message: String,
    date: { type: Date, default: Date.now },
  }],
  weeklyReport: {
    type: String,
    default: 'No updates yet',
  }
});

module.exports = mongoose.model('ParentalTracking', ParentalTrackingSchema);
