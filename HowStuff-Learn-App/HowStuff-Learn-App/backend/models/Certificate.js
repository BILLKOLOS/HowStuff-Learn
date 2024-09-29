const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule', required: true },
  issuedAt: { type: Date, default: Date.now },
  certificateLink: { type: String }  // Link to the downloadable certificate
});

module.exports = mongoose.model('Certificate', CertificateSchema);
