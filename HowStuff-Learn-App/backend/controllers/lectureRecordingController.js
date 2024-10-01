const Lecture = require('../models/Lecture');
const User = require('../models/User');
const notificationService = require('../utils/notificationService'); // For sending notifications

// Record a new lecture
exports.recordLecture = async (req, res) => {
    try {
        const { lectureId, recordingUrl } = req.body;

        // Find the lecture and update it with the recording URL
        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { recordingUrl, status: 'recorded' },
            { new: true }
        );

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Notify users about the recorded lecture
        const user = await User.findById(lecture.userId);
        await notificationService.sendLectureRecordedNotification(user.email, lecture);

        res.status(200).json({ message: 'Lecture recorded successfully', lecture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Recording failed', error });
    }
};

// Get the recording for a specific lecture
exports.getLectureRecording = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);

        if (!lecture || !lecture.recordingUrl) {
            return res.status(404).json({ message: 'Recording not found' });
        }

        res.status(200).json({ recordingUrl: lecture.recordingUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve recording', error });
    }
};

// Get all recorded lectures for a user
exports.getUserRecordedLectures = async (req, res) => {
    try {
        const { userId } = req.params;
        const lectures = await Lecture.find({ userId, status: 'recorded' });

        res.status(200).json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve recorded lectures', error });
    }
};

// Delete a recording for a specific lecture
exports.deleteLectureRecording = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Find the lecture and remove the recording URL
        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { recordingUrl: null, status: 'scheduled' }, // Resetting status to scheduled
            { new: true }
        );

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Notify users about the deleted recording
        const user = await User.findById(lecture.userId);
        await notificationService.sendLectureRecordingDeletedNotification(user.email, lecture);

        res.status(200).json({ message: 'Lecture recording deleted successfully', lecture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete recording', error });
    }
};

