const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
  },
  moduleId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'LearningModule', 
      required: true 
  },
  issuedAt: { 
      type: Date, 
      default: Date.now 
  },
  expirationDate: {
      type: Date, // Date when the certificate expires
  },
  certificateNumber: { 
      type: String, 
      required: true,
      unique: true, // Ensure the certificate number is unique
  },
  status: {
      type: String,
      enum: ['active', 'revoked', 'expired'], // Status options
      default: 'active', // Default status
  },
  courseTitle: {
      type: String,
      required: true,
  },
  issuedBy: {
      type: String,
      required: true, // Name of the institution or organization
  },
  signatureUrl: {
      type: String, // URL for the digital signature image
  },
  certificateLink: { 
      type: String // Link to the downloadable certificate 
  },
  metadata: {
      type: Map,
      of: String, // Key-value pairs for any additional information
  },
});

module.exports = mongoose.model('Certificate', CertificateSchema);
