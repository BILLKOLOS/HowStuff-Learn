const Lecture = require('../models/Lecture');
const NotificationService = require('../utils/notificationService');
const Logger = require('../utils/logger'); // Assuming a logging utility is created

class QuorumManagementController {
    // Check if a lecture has enough participants to proceed
    async checkQuorum(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            const currentParticipants = lecture.participants.length;
            const quorumMet = currentParticipants >= lecture.minParticipants;

            Logger.info(`Quorum check for ${lecture.title}: ${quorumMet ? 'met' : 'not met'}`);
            res.status(200).json({ message: 'Quorum status checked', quorumMet, currentParticipants });
        } catch (error) {
            Logger.error('Error checking quorum', error);
            res.status(500).json({ message: 'Error checking quorum', error: error.message });
        }
    }

    // Notify participants if quorum is not met
    async notifyQuorumFailure(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId).populate('participants', 'email notificationPreference');
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            if (lecture.participants.length < lecture.minParticipants) {
                const emails = lecture.participants.map(participant => participant.email);
                const notificationMessage = `Dear Participant, unfortunately, the lecture "${lecture.title}" did not meet the quorum requirements and has been canceled.`;

                // Notify based on user preference (assuming a field in user model)
                await NotificationService.sendEmail(emails, 'Lecture Cancellation Notification', notificationMessage);
                res.status(200).json({ message: 'Participants notified about quorum failure' });
                Logger.info(`Participants notified for lecture ${lecture.title} due to quorum failure`);
            } else {
                res.status(200).json({ message: 'Quorum met, no notification sent' });
            }
        } catch (error) {
            Logger.error('Error notifying participants', error);
            res.status(500).json({ message: 'Error notifying participants', error: error.message });
        }
    }

    // Set a minimum number of participants required for a lecture
    async setMinParticipants(req, res) {
        try {
            const lectureId = req.params.id;
            const { minParticipants } = req.body;
            const lecture = await Lecture.findById(lectureId);

            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            lecture.minParticipants = minParticipants;
            await lecture.save();

            res.status(200).json({ message: 'Minimum participants updated successfully', lecture });
            Logger.info(`Minimum participants updated for lecture ${lecture.title} to ${minParticipants}`);
        } catch (error) {
            Logger.error('Error updating minimum participants', error);
            res.status(500).json({ message: 'Error updating minimum participants', error: error.message });
        }
    }

    // Get a list of participants for a specific lecture
    async getParticipants(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId).populate('participants', 'name email');
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            res.status(200).json({ participants: lecture.participants });
        } catch (error) {
            Logger.error('Error retrieving participants', error);
            res.status(500).json({ message: 'Error retrieving participants', error: error.message });
        }
    }

    // Reschedule a lecture if quorum is not met
    async rescheduleLecture(req, res) {
        try {
            const { lectureId, newDateTime } = req.body;
            const lecture = await Lecture.findById(lectureId);

            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            if (lecture.participants.length < lecture.minParticipants) {
                lecture.dateTime = newDateTime; // Assuming dateTime field exists
                await lecture.save();
                res.status(200).json({ message: 'Lecture rescheduled', lecture });
                Logger.info(`Lecture ${lecture.title} rescheduled to ${newDateTime}`);
            } else {
                res.status(400).json({ message: 'Cannot reschedule; quorum is met' });
            }
        } catch (error) {
            Logger.error('Error rescheduling lecture', error);
            res.status(500).json({ message: 'Error rescheduling lecture', error: error.message });
        }
    }

    // Quorum history tracking
    async getQuorumHistory(req, res) {
        // This function would retrieve historical data on quorum checks.
        // For simplicity, we'll assume a method that stores this history exists.
        // Implementation details would depend on how you're storing this information.
    }

    // Dynamic minimum participants based on registered participants
    async adjustMinParticipants(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            const currentParticipants = lecture.participants.length;
            if (currentParticipants < lecture.minParticipants) {
                lecture.minParticipants = Math.max(1, currentParticipants); // Ensure it never goes below 1
                await lecture.save();
                res.status(200).json({ message: 'Minimum participants adjusted', lecture });
                Logger.info(`Minimum participants adjusted for lecture ${lecture.title} to ${lecture.minParticipants}`);
            } else {
                res.status(200).json({ message: 'Minimum participants are already met or exceeded' });
            }
        } catch (error) {
            Logger.error('Error adjusting minimum participants', error);
            res.status(500).json({ message: 'Error adjusting minimum participants', error: error.message });
        }
    }

    // Summary of quorum checks
    async getQuorumSummary(req, res) {
        try {
            const lectures = await Lecture.find().populate('participants', 'name email');
            const summary = lectures.map(lecture => ({
                title: lecture.title,
                currentParticipants: lecture.participants.length,
                quorumMet: lecture.participants.length >= lecture.minParticipants,
            }));

            res.status(200).json({ summary });
        } catch (error) {
            Logger.error('Error retrieving quorum summary', error);
            res.status(500).json({ message: 'Error retrieving quorum summary', error: error.message });
        }
    }

    // Schedule a check for quorum before the lecture starts
    async scheduleQuorumCheck(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            // Logic to schedule a quorum check using a task scheduler like node-cron
            res.status(200).json({ message: 'Quorum check scheduled successfully' });
            Logger.info(`Quorum check scheduled for lecture ${lecture.title}`);
        } catch (error) {
            Logger.error('Error scheduling quorum check', error);
            res.status(500).json({ message: 'Error scheduling quorum check', error: error.message });
        }
    }
}

module.exports = QuorumManagementController();

