const mongoose = require('mongoose');

// VirtualLab Schema with activity logs and updated methods
const VirtualLabSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  difficultyLevel: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userEngagement: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserEngagement' }],
  arContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ARContent' }],
  vrContent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'VRContent' }],
  experiments: [{
    title: { type: String, required: true },
    description: { type: String },
    steps: [{ type: String }],
    results: [{ type: String }],
    materialsNeeded: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  interactions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interactionType: { type: String, enum: ['Start', 'Complete', 'Feedback'], required: true },
    interactionTime: { type: Date, default: Date.now },
    feedback: { type: String },
  }],
  progressReports: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, min: 0, max: 100 },
    reportDate: { type: Date, default: Date.now },
  }],
  certifications: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateAwarded: { type: Date, default: Date.now },
    certificateUrl: { type: String },
  }],
  collaboration: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborationDate: { type: Date, default: Date.now },
  }],
  activityLogs: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, enum: ['Enroll', 'Complete'], required: true },
    activityTime: { type: Date, default: Date.now },
  }]
});

// Middleware to update the updatedAt timestamp
VirtualLabSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if a user is already enrolled in the lab
VirtualLabSchema.methods.isUserEnrolled = function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid User ID');
  }
  return this.progressReports.some(report => report.userId.equals(userId));
};

// Method to enroll a user in the virtual lab
VirtualLabSchema.methods.enrollUser = function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid User ID');
  }
  
  if (this.isUserEnrolled(userId)) {
    throw new Error('User is already enrolled in this lab');
  }

  // Proceed with enrollment logic
  this.progressReports.push({ userId, progress: 0 });
  
  // Log the enrollment activity
  this.activityLogs.push({
    userId,
    activityType: 'Enroll',
    activityTime: Date.now()
  });
};

// Method to check if the user is eligible for a certificate
VirtualLabSchema.methods.issueCertificate = function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid User ID');
  }

  const report = this.progressReports.find(report => report.userId.equals(userId));
  if (!report) {
    throw new Error('No progress report found for this user');
  }

  // Define completion criteria (e.g., progress must be 100%)
  if (report.progress === 100) {
    const certificateData = {
      userId,
      dateAwarded: Date.now(),
      certificateUrl: `https://yourapp.com/certificates/${userId}/${this._id}`
    };

    this.certifications.push(certificateData);
    
    // Log the completion activity
    this.activityLogs.push({
      userId,
      activityType: 'Complete',
      activityTime: Date.now()
    });

    return certificateData;
  } else {
    throw new Error('User has not completed the lab yet');
  }
};

// Export the VirtualLab model
const VirtualLab = mongoose.model('VirtualLab', VirtualLabSchema);
module.exports = VirtualLab;
