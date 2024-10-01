const mongoose = require('mongoose');
const { Schema } = mongoose;

// Study Group Schema Definition
const studyGroupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Ensures each group has a unique name
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model (creator of the study group)
        required: true,
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject', // Reference to the Subject model for better categorization
        required: true, // Subject or topic of the study group
    },
    meetingSchedule: [{
        date: {
            type: Date,
            required: true,
        },
        agenda: {
            type: String,
            required: true,
            trim: true,
        },
        notes: {
            type: String, // Optional field for meeting notes
            trim: true,
        },
        duration: {
            type: Number, // Duration of the meeting in minutes
            min: 0,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true, // To track if the study group is active
    },
});

// Middleware to update `updatedAt` before saving
studyGroupSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to validate members
studyGroupSchema.pre('save', function(next) {
    if (this.members.length === 0) {
        return next(new Error('A study group must have at least one member.'));
    }
    next();
});

// Indexing for better performance
studyGroupSchema.index({ name: 1, subject: 1 });

// Instance methods for managing members
studyGroupSchema.methods.addMember = async function(userId) {
    if (!this.members.includes(userId)) {
        this.members.push(userId);
        await this.save();
        // Send notification logic can be implemented here
    } else {
        throw new Error('User is already a member of the study group.');
    }
};

studyGroupSchema.methods.removeMember = async function(userId) {
    const index = this.members.indexOf(userId);
    if (index > -1) {
        this.members.splice(index, 1);
        await this.save();
        // Send notification logic can be implemented here
    } else {
        throw new Error('User is not a member of the study group.');
    }
};

// Method to notify members about upcoming meetings
studyGroupSchema.methods.notifyMembers = function() {
    // Implement notification logic (e.g., using email or push notifications)
    this.meetingSchedule.forEach(meeting => {
        // Example: Notify all members of the meeting details
        console.log(`Reminder: Meeting scheduled on ${meeting.date} for ${this.name}. Agenda: ${meeting.agenda}`);
        // Here, you could implement actual notification sending code
    });
};

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;
