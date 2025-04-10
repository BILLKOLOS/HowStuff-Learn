const Lecture = require('../models/Lecture');
const User = require('../models/User');
const Question = require('../models/Question');
const Poll = require('../models/Poll');
const LectureRecording = require('../models/LectureRecording');
const Feedback = require('../models/Feedback');
const { sendEmailNotification } = require('../utils/emailService');

// Create a new lecture
exports.createLecture = async (req, res) => {
    try {
        const { title, description, resourcePersonId, scheduledTime, quorum } = req.body;

        const newLecture = new Lecture({
            title,
            description,
            resourcePerson: resourcePersonId,
            scheduledTime,
            quorum,
            status: 'upcoming',
            attendees: [],
            isCompleted: false,
        });

        await newLecture.save();
        res.status(201).json({ message: 'Lecture created successfully', lecture: newLecture });
    } catch (error) {
        res.status(500).json({ message: 'Error creating lecture', error });
    }
};

// Schedule a lecture
exports.scheduleLecture = async (req, res) => {
    try {
        const { lectureId, scheduledTime } = req.body;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        lecture.scheduledTime = scheduledTime;
        lecture.status = 'scheduled';
        await lecture.save();

        res.status(200).json({ message: 'Lecture scheduled successfully', lecture });
    } catch (error) {
        res.status(500).json({ message: 'Error scheduling lecture', error });
    }
};

// Start a live lecture
exports.startLiveLecture = async (req, res) => {
    try {
        const lectureId = req.params.lectureId;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        lecture.status = 'live';
        await lecture.save();

        // Notify resource person and attendees about the start of the live lecture
        const resourcePerson = await User.findById(lecture.resourcePerson);
        sendEmailNotification(resourcePerson.email, `Your lecture "${lecture.title}" is now live.`);

        res.status(200).json({ message: 'Lecture started successfully', lecture });
    } catch (error) {
        res.status(500).json({ message: 'Error starting lecture', error });
    }
};

// Join a lecture
exports.joinLecture = async (req, res) => {
    try {
        const lectureId = req.params.lectureId;
        const userId = req.user.id;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        // Check if user has already joined the lecture
        if (lecture.attendees.includes(userId)) {
            return res.status(400).json({ message: 'You are already in the lecture' });
        }

        // Add user to lecture attendees
        lecture.attendees.push(userId);
        await lecture.save();

        // Notify resource person if quorum is reached
        if (lecture.attendees.length >= lecture.quorum) {
            const resourcePerson = await User.findById(lecture.resourcePerson);
            sendEmailNotification(resourcePerson.email, `Quorum met for your lecture "${lecture.title}"`);
        }

        res.status(200).json({ message: 'You have joined the lecture', lecture });
    } catch (error) {
        res.status(500).json({ message: 'Error joining lecture', error });
    }
};

// Complete a lecture
exports.completeLecture = async (req, res) => {
    try {
        const lectureId = req.params.lectureId;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        lecture.isCompleted = true;
        await lecture.save();

        res.status(200).json({ message: 'Lecture marked as completed', lecture });
    } catch (error) {
        res.status(500).json({ message: 'Error completing lecture', error });
    }
};

// Record a lecture
exports.recordLecture = async (req, res) => {
    try {
        const { lectureId, recordingUrl } = req.body;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        const newRecording = new LectureRecording({
            lecture: lectureId,
            recordingUrl,
        });

        await newRecording.save();
        res.status(201).json({ message: 'Lecture recorded successfully', recording: newRecording });
    } catch (error) {
        res.status(500).json({ message: 'Error recording lecture', error });
    }
};

// Submit feedback for a lecture
exports.submitFeedback = async (req, res) => {
    try {
        const { lectureId, feedbackText } = req.body;

        const feedback = new Feedback({
            lecture: lectureId,
            user: req.user.id,
            text: feedbackText,
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};

// Create a new poll
exports.createPoll = async (req, res) => {
    try {
        const { lectureId, question, options } = req.body;

        const newPoll = new Poll({
            lecture: lectureId,
            question,
            options,
        });

        await newPoll.save();
        res.status(201).json({ message: 'Poll created successfully', poll: newPoll });
    } catch (error) {
        res.status(500).json({ message: 'Error creating poll', error });
    }
};

// Predict attendance for a lecture
exports.predictAttendance = async (req, res) => {
    try {
        const lectureId = req.params.lectureId;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        // Example prediction logic (could be based on historical data or user engagement)
        const predictedAttendance = Math.ceil(lecture.quorum * 1.2); // Predicting 20% more attendees than quorum

        res.status(200).json({ predictedAttendance });
    } catch (error) {
        res.status(500).json({ message: 'Error predicting attendance', error });
    }
};

// Generate a notification message for a lecture
exports.generateNotificationMessage = (lecture) => {
    const baseMessage = `Reminder: The lecture "${lecture.title}" is scheduled for ${lecture.scheduledTime}.`;
    if (lecture.attendees.length < lecture.quorum) {
        return `${baseMessage} Current attendees: ${lecture.attendees.length}.`;
    }
    return baseMessage;
};

// Adjust content delivery based on user engagement
exports.adjustContentDelivery = async (req, res) => {
    try {
        const lectureId = req.params.lectureId;
        const engagementData = req.body.engagementData; // Assume engagement data comes from client-side

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

        // Example logic to adjust content delivery
        if (engagementData && engagementData.averageEngagement < 0.5) {
            lecture.contentDeliveryMode = 'interactive'; // Switch to more interactive mode if engagement is low
        } else {
            lecture.contentDeliveryMode = 'standard';
        }

        await lecture.save();
        res.status(200).json({ message: 'Content delivery adjusted successfully', lecture });
    } catch (error) {
        res.status(500).json({ message: 'Error adjusting content delivery', error });
    }
};

// Answer a poll
exports.answerPoll = async (req, res) => {
    try {
        const { pollId, selectedOption } = req.body;

        const poll = await Poll.findById(pollId);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        // Check if the user has already answered the poll
        if (poll.responses.some(response => response.user.equals(req.user.id))) {
            return res.status(400).json({ message: 'You have already answered this poll' });
        }

        poll.responses.push({ user: req.user.id, selectedOption });
        await poll.save();

        res.status(200).json({ message: 'Poll answered successfully', poll });
    } catch (error) {
        res.status(500).json({ message: 'Error answering poll', error });
    }
};
