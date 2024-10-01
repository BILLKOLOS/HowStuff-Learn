const Mentorship = require('../models/Mentorship');

// Create a mentorship
exports.createMentorship = async (req, res) => {
    try {
        const mentorship = new Mentorship(req.body);
        await mentorship.save();
        res.status(201).json(mentorship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all mentorships
exports.getAllMentorships = async (req, res) => {
    try {
        const mentorships = await Mentorship.find().populate('mentor mentee');
        res.status(200).json(mentorships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update mentorship
exports.updateMentorship = async (req, res) => {
    try {
        const updatedMentorship = await Mentorship.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedMentorship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete mentorship
exports.deleteMentorship = async (req, res) => {
    try {
        await Mentorship.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Mentorship deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
