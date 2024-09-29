const mongoose = require('mongoose');

const ParentChildAccountSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  linkedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParentChildAccount', ParentChildAccountSchema);
