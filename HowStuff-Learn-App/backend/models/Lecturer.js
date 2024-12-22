const mongoose = require('mongoose');

// Define the Lecturer schema
const LecturerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    uniqueCode: {
        type: String,
        required: true,
        unique: true, // Ensures each lecturer has a distinct code
    },
    department: {
        type: String,
        required: false,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course', // Assuming you have a Course model
        },
    ],
    dateOfJoining: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
 
// Export the Lecturer model
module.exports = mongoose.model('Lecturer', LecturerSchema);
