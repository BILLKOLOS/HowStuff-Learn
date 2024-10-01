const mongoose = require('mongoose');

const ParentalTrackingSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  progressReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProgressReport' }],
  notifications: [{
    message: String,
    date: { type: Date, default: Date.now },
  }],
  weeklyReport: {
    type: String,
    default: 'No updates yet',
  },
  notificationSettings: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
  },
  learningGoals: [{
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningGoal' },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  }],
  communicationLogs: [{
    message: String,
    date: { type: Date, default: Date.now },
    from: { type: String, enum: ['Parent', 'Teacher', 'Admin'] },
  }],
  accessLevel: {
    type: String,
    enum: ['Full Access', 'Summary Only'],
    default: 'Summary Only',
  },
  performanceSummary: {
    overallGrade: { type: Number, min: 0, max: 100, default: 0 },
    recentActivities: [{ type: String }],
  },
  reportDateRange: {
    startDate: { type: Date },
    endDate: { type: Date },
  },
});

module.exports = mongoose.model('ParentalTracking', ParentalTrackingSchema);
