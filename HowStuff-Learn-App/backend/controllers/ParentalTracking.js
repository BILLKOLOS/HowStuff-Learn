const ParentalTracking = require('../models/ParentalTracking');

// Create a parental tracking entry
exports.createParentalTracking = async (req, res) => {
    try {
        const tracking = new ParentalTracking(req.body);
        await tracking.save();
        res.status(201).json(tracking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get parental tracking for a user
exports.getParentalTracking = async (req, res) => {
    try {
        const tracking = await ParentalTracking.find({ child: req.params.userId });
        res.status(200).json(tracking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
