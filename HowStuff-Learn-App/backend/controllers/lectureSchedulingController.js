const Lecture = require('../models/Lecture');
const User = require('../models/User');
const notificationService = require('../utils/notificationService'); // For sending notifications

// Schedule a new lecture
exports.scheduleLecture = async (req, res) => {
    try {
        const { userId, topic, dateTime, duration } = req.body;

        // Create a new lecture entry in the database
        const lecture = await Lecture.create({
            userId,
            topic,
            dateTime,
            duration,
            participantsCount: 0,
            feedbackCount: 0,
            status: 'scheduled', // Possible statuses: scheduled, confirmed, canceled
        });

        // Notify users about the scheduled lecture
        const user = await User.findById(userId);
        await notificationService.sendLectureScheduledNotification(user.email, lecture);

        res.status(201).json({ message: 'Lecture scheduled successfully', lecture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lecture scheduling failed', error });
    }
};

// Confirm a scheduled lecture
exports.confirmLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Update lecture status to confirmed
        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { status: 'confirmed' },
            { new: true }
        );

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Notify users about the confirmed lecture
        const user = await User.findById(lecture.userId);
        await notificationService.sendLectureConfirmedNotification(user.email, lecture);

        res.status(200).json({ message: 'Lecture confirmed successfully', lecture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lecture confirmation failed', error });
    }
};

// Cancel a scheduled lecture
exports.cancelLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Update lecture status to canceled
        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { status: 'canceled' },
            { new: true }
        );

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Notify users about the canceled lecture
        const user = await User.findById(lecture.userId);
        await notificationService.sendLectureCanceledNotification(user.email, lecture);

        res.status(200).json({ message: 'Lecture canceled successfully', lecture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lecture cancellation failed', error });
    }
};

// Get all scheduled lectures for a user
exports.getUserLectures = async (req, res) => {
    try {
        const { userId } = req.params;
        const lectures = await Lecture.find({ userId });

        res.status(200).json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve lectures', error });
    }
};

// Get details of a specific lecture
exports.getLectureDetails = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        res.status(200).json(lecture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve lecture details', error });
    }
};

