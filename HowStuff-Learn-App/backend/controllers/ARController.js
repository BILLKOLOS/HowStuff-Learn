const ARContent = require('../models/ARContent');
const ARVRInteractionLog = require('../models/ARVRInteractionLog');

// Fetch all AR content
exports.getAllARContent = async (req, res) => {
    try {
        const content = await ARContent.find();
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch AR content by ID
exports.getARContentById = async (req, res) => {
    try {
        const content = await ARContent.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Log user interaction with AR content
exports.logARInteraction = async (req, res) => {
    try {
        const { userId, contentId, durationSpent } = req.body;

        // Validate input data
        if (!userId || !contentId || typeof durationSpent !== 'number') {
            return res.status(400).json({ success: false, message: 'Invalid input data' });
        }

        const log = new ARVRInteractionLog({
            userId,
            contentId,
            contentType: 'AR',
            durationSpent
        });
        await log.save();
        res.status(201).json({ success: true, message: 'Interaction logged successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
