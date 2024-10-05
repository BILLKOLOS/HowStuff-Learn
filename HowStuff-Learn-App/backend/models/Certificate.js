const mongoose = require('mongoose');
const crypto = require('crypto'); // To help generate a unique token
// You might want to use a blockchain library like web3.js or ethers.js for actual blockchain interactions

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
  revocationReason: {
      type: String, // Reason for revocation, if applicable
  },
  recipientName: {
      type: String, // Name of the certificate recipient
      required: true,
  },
  recipientEmail: {
      type: String, // Email of the certificate recipient
      required: true,
  },
  revokedAt: {
      type: Date, // Date when the certificate was revoked
  },
  issuingAuthority: {
      type: String, // Authority responsible for issuing the certificate
  },
  customFields: {
      type: Map, // Customizable fields for dynamic data
      of: String,
  },
  reviewStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // Status of the review process
      default: 'pending',
  },
  linkedAssessments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment', // Reference to related assessments
  }],
  designTemplate: {
      type: String, // Template used for the certificate design
  },
  verificationToken: {
      type: String, // Token for certificate verification
      required: true, // Ensure a token is generated for verification
  },
  awardDate: {
      type: Date, // Actual date when the certificate is awarded
  },
  blockchainRecord: {
      type: String, // Reference to the blockchain record or transaction hash
      required: true, // Required to link the certificate to the blockchain
  },
  blockchainVerified: {
      type: Boolean,
      default: false, // Indicates whether the certificate has been verified on the blockchain
  },
});

// Create a pre-save hook to generate a verification token and blockchain record
CertificateSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Generate a unique verification token
        this.verificationToken = generateUniqueToken(); 

        // Create a blockchain record and get the transaction hash
        this.blockchainRecord = await createBlockchainRecord(this); 
    }
    next();
});

// Function to generate a unique token
function generateUniqueToken() {
    return crypto.randomBytes(16).toString('hex'); // Generates a unique 32-character hexadecimal token
}

// Function to create a blockchain record
async function createBlockchainRecord(certificate) {
    try {
        // This is a placeholder for actual blockchain interaction
        // Integrate your blockchain logic here (e.g., using web3.js or ethers.js)
        // For example:
        // const txHash = await yourBlockchainService.createCertificate(certificate);
        const txHash = 'mock-blockchain-transaction-hash'; // Replace with actual transaction hash from blockchain

        // Log or handle the transaction hash as needed
        return txHash;
    } catch (error) {
        console.error("Error creating blockchain record:", error);
        throw new Error("Blockchain record creation failed");
    }
}

module.exports = mongoose.model('Certificate', CertificateSchema);
