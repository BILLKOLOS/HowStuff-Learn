const mongoose = require('mongoose');
const { Schema } = mongoose;

// Virtual Lecture Schema Definition
const virtualLectureSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    scheduledTime: {
        type: Date,
        required: true, // When the lecture is scheduled to take place
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the user hosting the lecture
        required: true,
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // References to users participating in the lecture
    }],
    resources: [{
        resourceType: {
            type: String,
            enum: ['slide', 'video', 'article'],
            required: true,
        },
        resourceUrl: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
                },
                message: props => `${props.value} is not a valid URL!`
            },
        },
        description: {
            type: String,
        }
    }],
    meetingLink: {
        type: String,
        required: true, // Link to the virtual meeting platform
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
            },
            message: props => `${props.value} is not a valid URL!`
        },
    },
    interactiveElements: [{
        elementType: {
            type: String,
            enum: ['poll', 'quiz', 'Q&A'],
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        options: [String],
        correctAnswer: {
            type: String,
        }
    }],
    recording: {
        url: {
            type: String,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+\..+/i.test(v); // Simple URL validation
                },
                message: props => `${props.value} is not a valid URL!`
            },
        },
        keyTimestamps: [{
            topic: {
                type: String,
            },
            time: {
                type: Number, // in seconds
            }
        }]
    },
    userEngagement: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        questionsAsked: {
            type: Number,
            default: 0,
        },
        pollsParticipated: {
            type: Number,
            default: 0,
        }
    }],
    feedback: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Reference to the user who gave feedback
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true, // Rating from 1 to 5
        },
        comment: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
    notifications: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User', // User to notify
        },
        preferences: {
            email: {
                type: Boolean,
                default: true,
            },
            push: {
                type: Boolean,
                default: true,
            }
        }
    }],
    discussionThreadId: {
        type: String,
    },
    interactionMode: {
        type: String,
        enum: ['live', 'recorded', 'AR', 'VR'],
        required: true,
    },
    adminControls: {
        canEdit: {
            type: Boolean,
            default: false,
        },
        analytics: {
            views: {
                type: Number,
                default: 0,
            },
            averageFeedback: {
                type: Number,
                default: 0,
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now, // Timestamp for when the lecture was created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Timestamp for when the lecture was last updated
    },
});

// Middleware to update `updatedAt` before saving
virtualLectureSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create Virtual Lecture model
const VirtualLecture = mongoose.model('VirtualLecture', virtualLectureSchema);

// Export the Virtual Lecture model
module.exports = VirtualLecture;
