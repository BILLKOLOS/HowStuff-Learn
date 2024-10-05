const Activity = require('../models/Activity');

// Create a new activity
exports.createActivity = async (req, res) => {
    try {
        const activity = new Activity({
            ...req.body,
            createdBy: req.user._id, // assuming user is authenticated
        });
        await activity.save();
        res.status(201).json({ message: 'Activity created successfully', activity });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all activities
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get activity by ID
exports.getActivityById = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an activity
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'Activity updated successfully', activity });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search and filter activities
exports.searchActivities = async (req, res) => {
    try {
        const filters = req.query; // Assuming filters are passed as query parameters
        const activities = await Activity.findByFilters(filters);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
