const mongoose = require('mongoose');
const { Schema } = mongoose;

// Project Schema Definition
const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from both ends
    },
    description: {
        type: String,
        required: true, // Brief description of the project
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who created the project
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Array of user references for project members
    }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'On Hold'], // Define project statuses
        default: 'Pending', // Default status is pending
    },
    startDate: {
        type: Date, // Start date of the project
    },
    endDate: {
        type: Date, // End date of the project
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the project was created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the project was last updated
    },
    milestones: [{
        title: { type: String, required: true }, // Title of the milestone
        description: { type: String }, // Description of the milestone
        dueDate: { type: Date }, // Due date for the milestone
        completed: { type: Boolean, default: false }, // Indicates if the milestone is completed
    }],
    resources: [{
        type: String, // Links to any resources related to the project
    }],
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'], // Priority levels for the project
        default: 'Medium', // Default priority is medium
    },
});

// Middleware to update `updatedAt` before saving
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Project model
const Project = mongoose.model('Project', projectSchema);

// Export the Project model
module.exports = Project;
