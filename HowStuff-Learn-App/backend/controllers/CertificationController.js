const Certification = require('../models/Certification');
const LearningPath = require('../models/LearningPath');
const User = require('../models/User');
const Course = require('../models/Course');

// Issue certificate after course or learning path completion
exports.issueCertificate = async (req, res) => {
    try {
        const { userId, learningPathId, courseId } = req.body;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user has completed the learning path or course
        if (learningPathId) {
            const learningPath = await LearningPath.findById(learningPathId);
            if (!learningPath || !user.completedLearningPaths.includes(learningPathId)) {
                return res.status(400).json({ message: 'User has not completed the learning path.' });
            }
        }

        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course || !user.completedCourses.includes(courseId)) {
                return res.status(400).json({ message: 'User has not completed the course.' });
            }
        }

        // Create and issue certificate
        const certificate = new Certification({
            userId,
            courseId,
            learningPathId,
            issueDate: new Date()
        });

        await certificate.save();

        res.status(201).json({ message: 'Certificate issued successfully.', certificate });
    } catch (error) {
        res.status(500).json({ message: 'Error issuing certificate.', error });
    }
};

// View user's certificates
exports.getUserCertificates = async (req, res) => {
    try {
        const { userId } = req.params;

        const certificates = await Certification.find({ userId }).populate('courseId').populate('learningPathId');

        if (!certificates.length) {
            return res.status(404).json({ message: 'No certificates found for this user.' });
        }

        res.status(200).json({ message: 'Certificates retrieved successfully.', certificates });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving certificates.', error });
    }
};

// Verify certificate
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certification.findById(certificateId).populate('userId').populate('courseId').populate('learningPathId');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found.' });
        }

        res.status(200).json({ message: 'Certificate is valid.', certificate });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying certificate.', error });
    }
};
