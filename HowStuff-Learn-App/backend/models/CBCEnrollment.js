const mongoose = require('mongoose');

const CBCEnrollmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gradeLevel: { type: String, required: true },
    curriculum: { type: String, default: 'CBC' },
});

module.exports = mongoose.model('CBCEnrollment', CBCEnrollmentSchema);
