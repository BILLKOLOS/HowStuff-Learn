const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Progress = require('../models/Progress');

// Retrieve user dashboard data
exports.getDashboard = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).populate('children');
        const assessments = await Assessment.find({ createdBy: userId });
        const progress = await Progress.find({ userId });

        res.status(200).json({
            message: 'Dashboard data retrieved successfully',
            user,
            assessments,
            progress
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving dashboard data', error: error.message });
    }
};
