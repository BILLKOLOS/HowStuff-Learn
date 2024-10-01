const Activity = require('../models/Activity');
const Event = require('../models/Event'); // Assuming you have an Event model for daily events/learning activities
const notificationService = require('../utils/notificationService'); // For sending notifications

// Suggest an at-home activity based on the day's events
exports.suggestActivitiesAutomatically = async (req, res) => {
    try {
        const { userId } = req.body;

        // Fetch today's events or learning activities
        const today = new Date();
        const events = await Event.find({
            date: {
                $gte: new Date(today.setHours(0, 0, 0, 0)),
                $lt: new Date(today.setHours(23, 59, 59, 999)),
            },
        });

        // If there are no events, suggest default activities
        if (!events.length) {
            const defaultActivities = await Activity.find().limit(5); // Fetch default activities
            return res.status(200).json({ activities: defaultActivities });
        }

        // Map events to suggested activities
        const suggestedActivities = events.map(event => {
            // You could have a more complex algorithm to match activities based on events
            return {
                title: `Activity related to ${event.title}`,
                description: `Suggested activity for learning about ${event.topic}`,
                ageGroup: event.ageGroup,
                difficulty: event.difficulty,
            };
        });

        // Save suggested activities to the database (optional)
        const savedActivities = await Activity.insertMany(suggestedActivities);

        // Notify user about the new suggested activities
        await notificationService.sendActivitySuggestionNotification(userId, savedActivities);

        res.status(200).json({ message: 'Activities suggested automatically', activities: savedActivities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to suggest activities automatically', error });
    }
};

// Get all activities for a specific age group
exports.getActivitiesByAgeGroup = async (req, res) => {
    try {
        const { ageGroup } = req.params;
        const activities = await Activity.find({ ageGroup });

        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve activities', error });
    }
};

// Get activity details by ID
exports.getActivityById = async (req, res) => {
    try {
        const { activityId } = req.params;
        const activity = await Activity.findById(activityId);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json(activity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve activity', error });
    }
};

// Update an existing activity
exports.updateActivity = async (req, res) => {
    try {
        const { activityId } = req.params;
        const { title, description, ageGroup, difficulty } = req.body;

        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            { title, description, ageGroup, difficulty },
            { new: true, runValidators: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ message: 'Activity updated successfully', updatedActivity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update activity', error });
    }
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const { activityId } = req.params;

        const deletedActivity = await Activity.findByIdAndDelete(activityId);
        if (!deletedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete activity', error });
    }
};

