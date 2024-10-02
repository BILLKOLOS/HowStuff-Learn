const mongoose = require('mongoose');
const { Schema } = mongoose;

// Attendance Schema Definition
const attendanceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    lectureId: {
        type: Schema.Types.ObjectId,
        ref: 'VirtualLecture',
        required: true,
    },
    attended: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Create Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Export the Attendance model
module.exports = Attendance;
