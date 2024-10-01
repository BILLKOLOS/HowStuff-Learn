const mongoose = require('mongoose');

const ParentChildAccountSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkedAt: { type: Date, default: Date.now },
  accountType: {
    type: String,
    enum: ['Parent', 'Guardian', 'Other'],
    required: true,
  },
  relationshipType: {
    type: String,
    enum: ['Biological', 'Adoptive', 'Step-parent', 'Other'],
    required: true,
  },
  permissions: {
    type: [String],
    enum: ['View Progress', 'Receive Notifications', 'Edit Goals'],
    default: ['View Progress'],
  },
  notificationSettings: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
  },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ParentChildAccount', ParentChildAccountSchema);
