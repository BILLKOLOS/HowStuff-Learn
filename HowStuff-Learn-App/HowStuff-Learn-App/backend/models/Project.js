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
    learningGoals: [{
        type: Schema.Types.ObjectId,
        ref: 'LearningGoal', // Reference to the related learning goals
    }],
    projectType: {
        type: String,
        enum: ['research', 'group', 'individual'],
        required: true,
    },
    tags: [{
        type: String,
        trim: true, // Remove whitespace from both ends
    }],
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' }, // User who commented
        text: { type: String, required: true }, // Comment text
        createdAt: { type: Date, default: Date.now }, // Timestamp of the comment
    }],
    progress: {
        percentage: { type: Number, min: 0, max: 100, default: 0 }, // Project completion percentage
        statusLog: [{
            status: { type: String }, // Status update
            createdAt: { type: Date, default: Date.now }, // Timestamp of the status update
        }],
    },
    externalResources: [{
        title: { type: String, required: true }, // Title of the external resource
        url: { 
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
                },
                message: props => `${props.value} is not a valid URL!`
            },
        },
    }],
    feedback: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' }, // User providing feedback
        rating: { type: Number, min: 1, max: 5 }, // Rating for the project
        comment: { type: String }, // Feedback comment
        createdAt: { type: Date, default: Date.now }, // Timestamp of the feedback
    }],
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
