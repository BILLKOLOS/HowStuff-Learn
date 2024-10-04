const express = require('express');
const router = express.Router();
const VirtualLab = require('../models/VirtualLab'); // Model for virtual labs
const User = require('../models/User'); // User model
const Certification = require('../models/Certification'); // Model for certifications
const Feedback = require('../models/Feedback'); // Model for user feedback

// Middleware for authentication
const authenticateUser = require('../middleware/authenticateUser');

// Create a new virtual lab simulation
router.post('/', authenticateUser, async (req, res) => {
    try {
        const newLab = new VirtualLab({
            labName: req.body.labName,
            subject: req.body.subject,
            experiment: req.body.experiment,
            resources: req.body.resources, // Links to any resources or guides for the lab
            createdBy: req.user.id,
        });

        await newLab.save();
        res.status(201).json({ message: 'Virtual lab created successfully.', lab: newLab });
    } catch (error) {
        res.status(500).json({ message: 'Error creating virtual lab.', error });
    }
});

// Get all virtual labs based on user level
router.get('/', authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const labs = await VirtualLab.find({ gradeLevel: user.gradeLevel }); // Filter labs by user grade level
        res.json({ message: 'Virtual labs retrieved successfully.', labs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving virtual labs.', error });
    }
});

// Get a virtual lab by ID
router.get('/:labId', authenticateUser, async (req, res) => {
    try {
        const lab = await VirtualLab.findById(req.params.labId);
        if (!lab) return res.status(404).json({ error: 'Lab not found' });
        res.json({ message: 'Virtual lab retrieved successfully.', lab });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving virtual lab.', error });
    }
});

// Update a virtual lab
router.put('/:labId', authenticateUser, async (req, res) => {
    try {
        const updatedLab = await VirtualLab.findByIdAndUpdate(
            req.params.labId,
            {
                labName: req.body.labName,
                subject: req.body.subject,
                experiment: req.body.experiment,
                resources: req.body.resources,
            },
            { new: true }
        );

        if (!updatedLab) {
            return res.status(404).json({ message: 'Virtual lab not found.' });
        }

        res.status(200).json({ message: 'Virtual lab updated successfully.', lab: updatedLab });
    } catch (error) {
        res.status(500).json({ message: 'Error updating virtual lab.', error });
    }
});

// Delete a virtual lab
router.delete('/:labId', authenticateUser, async (req, res) => {
    try {
        const deletedLab = await VirtualLab.findByIdAndDelete(req.params.labId);
        if (!deletedLab) {
            return res.status(404).json({ message: 'Virtual lab not found.' });
        }

        res.status(200).json({ message: 'Virtual lab deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting virtual lab.', error });
    }
});

// Enroll a user in a virtual lab simulation
router.post('/:labId/enroll', authenticateUser, async (req, res) => {
    try {
        const { labId } = req.params;
        const userId = req.user.id;

        const lab = await VirtualLab.findById(labId);
        if (!lab) {
            return res.status(404).json({ message: 'Virtual lab not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add user to enrolled users
        lab.enrolledUsers.push(userId);
        await lab.save();

        res.status(200).json({ message: 'User enrolled in virtual lab.', lab });
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling user in virtual lab.', error });
    }
});

// Start a virtual lab experiment
router.post('/:labId/start', authenticateUser, async (req, res) => {
    try {
        const lab = await VirtualLab.findById(req.params.labId);
        if (!lab) return res.status(404).json({ error: 'Lab not found' });

        // Logic to start the experiment (could involve setting up initial conditions)
        res.json({ message: 'Experiment started', lab });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Record results from the experiment
router.post('/:labId/results', authenticateUser, async (req, res) => {
    try {
        const { results } = req.body; // Results would come from the user input

        // Save results to user profile or send to a relevant model
        const feedback = new Feedback({
            userId: req.user.id,
            labId: req.params.labId,
            results,
        });

        await feedback.save();
        res.json({ message: 'Results recorded', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Provide user feedback and completion summary
router.post('/:labId/feedback', authenticateUser, async (req, res) => {
    try {
        const { rating, comments } = req.body;
        const feedback = new Feedback({
            userId: req.user.id,
            labId: req.params.labId,
            rating,
            comments,
        });

        await feedback.save();
        res.json({ message: 'Feedback submitted', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Issue certificate upon completion
router.post('/:labId/certificate', authenticateUser, async (req, res) => {
    try {
        const certificate = new Certification({
            userId: req.user.id,
            labId: req.params.labId,
            dateIssued: new Date(),
        });

        await certificate.save();
        res.json({ message: 'Certificate issued', certificate });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's progress
router.get('/progress', authenticateUser, async (req, res) => {
    try {
        const userFeedback = await Feedback.find({ userId: req.user.id });
        const progress = userFeedback.map((feedback) => ({
            labId: feedback.labId,
            results: feedback.results,
            rating: feedback.rating,
        }));

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
