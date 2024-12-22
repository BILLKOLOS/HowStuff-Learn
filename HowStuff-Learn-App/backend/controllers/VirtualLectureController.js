const Lecture = require('../models/Lecture'); 
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');
const auth = require('../middleware/authMiddleware');

class VirtualLectureController {
    // Create a new virtual lecture
    async createLecture(req, res) {
        try {
            const { title, description, scheduledTime, duration, link, topic, maxParticipants } = req.body;
            if (!title || !description || !scheduledTime || !duration || !link || !topic || !maxParticipants) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const lecture = new Lecture({
                title,
                description,
                scheduledTime,
                duration,
                link,
                topic,
                maxParticipants,
                participants: [],
                createdBy: req.user.id,
            });
            await lecture.save();
            res.status(201).json({ message: 'Lecture created successfully', lecture });
        } catch (error) {
            res.status(500).json({ message: 'Error creating lecture', error });
        }
    }

    // Join a scheduled virtual lecture
    async joinLecture(req, res) {
        try {
            const lectureId = req.params.id;
            const userId = req.user.id;

            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            if (lecture.participants.includes(userId)) {
                return res.status(400).json({ message: 'You have already joined this lecture' });
            }

            if (lecture.participants.length >= lecture.maxParticipants) {
                return res.status(400).json({ message: 'Lecture is full' });
            }

            lecture.participants.push(userId);
            await lecture.save();

            // Send a confirmation email to the user
            await this.sendJoinConfirmationEmail(req.user.email, lecture);

            res.status(200).json({ message: 'Joined lecture successfully', lecture });
        } catch (error) {
            res.status(500).json({ message: 'Error joining lecture', error });
        }
    }

    // Send a confirmation email to the user upon joining a lecture
    async sendJoinConfirmationEmail(email, lecture) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Successfully Joined Lecture: ${lecture.title}`,
                text: `You have successfully joined the lecture: ${lecture.title} scheduled for ${lecture.scheduledTime}.`,
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Cancel a scheduled virtual lecture
    async cancelLecture(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            if (lecture.createdBy.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You are not authorized to cancel this lecture' });
            }

            await Lecture.deleteOne({ _id: lectureId });
            res.status(200).json({ message: 'Lecture canceled successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error canceling lecture', error });
        }
    }

    // Get all scheduled lectures for the logged-in user
    async getUserLectures(req, res) {
        try {
            const userId = req.user.id;
            const lectures = await Lecture.find({ participants: userId }).populate('createdBy', 'name');
            res.status(200).json({ lectures });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving lectures', error });
        }
    }

    // Get details of a specific lecture
    async getLectureDetails(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId).populate('createdBy', 'name');
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }
            res.status(200).json({ lecture });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving lecture details', error });
        }
    }

    // Submit feedback after a lecture
    async submitFeedback(req, res) {
        try {
            const { lectureId, rating, comments } = req.body;
            if (!lectureId || !rating || typeof rating !== 'number') {
                return res.status(400).json({ message: 'Invalid feedback data' });
            }

            const feedback = new Feedback({
                lectureId,
                userId: req.user.id,
                rating,
                comments,
            });
            await feedback.save();
            res.status(201).json({ message: 'Feedback submitted successfully', feedback });
        } catch (error) {
            res.status(500).json({ message: 'Error submitting feedback', error });
        }
    }

    // Get feedback summary for a lecture
    async getFeedbackSummary(req, res) {
        try {
            const lectureId = req.params.id;
            const feedbacks = await Feedback.find({ lectureId });
            const summary = {
                averageRating: feedbacks.length ? feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length : 0,
                totalFeedbacks: feedbacks.length,
            };
            res.status(200).json({ summary });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving feedback summary', error });
        }
    }

    // List all lectures for a specific topic
    async getLecturesByTopic(req, res) {
        try {
            const { topic } = req.query;
            const lectures = await Lecture.find({ topic });
            res.status(200).json({ lectures });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving lectures by topic', error });
        }
    }

    // Enable live Q&A during lectures
    async enableLiveQandA(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }
            lecture.liveQAEnabled = true;
            await lecture.save();

            res.status(200).json({ message: 'Live Q&A enabled successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error enabling live Q&A', error });
        }
    }

    // Mute a participant
    async muteParticipant(req, res) {
        try {
            const { lectureId, userId } = req.body;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture || !lecture.participants.includes(userId)) {
                return res.status(404).json({ message: 'Lecture or participant not found' });
            }

            if (!lecture.mutedParticipants) {
                lecture.mutedParticipants = [];
            }
            if (!lecture.mutedParticipants.includes(userId)) {
                lecture.mutedParticipants.push(userId);
                await lecture.save();
            }

            res.status(200).json({ message: 'Participant muted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error muting participant', error });
        }
    }

    // Unmute a participant
    async unmuteParticipant(req, res) {
        try {
            const { lectureId, userId } = req.body;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture || !lecture.participants.includes(userId)) {
                return res.status(404).json({ message: 'Lecture or participant not found' });
            }

            if (lecture.mutedParticipants) {
                lecture.mutedParticipants = lecture.mutedParticipants.filter(id => id !== userId);
                await lecture.save();
            }

            res.status(200).json({ message: 'Participant unmuted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error unmuting participant', error });
        }
    }

    // Optimize video/audio settings
    async optimizeMediaSettings(req, res) {
        try {
            const { lectureId, quality } = req.body; // quality can be low, medium, high
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            lecture.mediaQuality = quality;
            await lecture.save();

            res.status(200).json({ message: 'Media settings optimized successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error optimizing media settings', error });
        }
    }

    // Record lecture session
    async recordLecture(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            lecture.isRecording = true; // Assuming you have an isRecording field
            await lecture.save();

            res.status(200).json({ message: 'Recording started successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error starting recording', error });
        }
    }

    // Stop recording lecture session
    async stopRecording(req, res) {
        try {
            const lectureId = req.params.id;
            const lecture = await Lecture.findById(lectureId);
            if (!lecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            lecture.isRecording = false; // Assuming you have an isRecording field
            await lecture.save();

            res.status(200).json({ message
                : 'Recording stopped successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error stopping recording', error });
            }
        }
    
        // Get lecture recording
        async getLectureRecording(req, res) {
            try {
                const lectureId = req.params.id;
                const lecture = await Lecture.findById(lectureId);
                if (!lecture) {
                    return res.status(404).json({ message: 'Lecture not found' });
                }
    
                // Assuming the lecture has a recording URL or file path
                if (!lecture.recordingUrl) {
                    return res.status(404).json({ message: 'Recording not available' });
                }
    
                res.status(200).json({ recordingUrl: lecture.recordingUrl });
            } catch (error) {
                res.status(500).json({ message: 'Error retrieving lecture recording', error });
            }
        }
    }
    
    module.exports = new VirtualLectureController();
    