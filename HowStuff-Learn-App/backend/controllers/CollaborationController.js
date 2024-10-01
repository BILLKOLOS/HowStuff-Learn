const StudyGroup = require('../models/StudyGroup');
const axios = require('axios');

// Create study group
exports.createStudyGroup = async (req, res) => {
    const { title, description, subject, members, platform } = req.body;

    try {
        const studyGroup = new StudyGroup({
            title,
            description,
            subject,
            members,
            platform,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await studyGroup.save();
        res.status(201).json({ message: 'Study group created successfully', studyGroup });

        // Notify members via Slack or Discord
        if (platform === 'Slack') {
            notifySlack(studyGroup);
        } else if (platform === 'Discord') {
            notifyDiscord(studyGroup);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create study group', details: error.message });
    }
};

// Function to notify members on Slack
const notifySlack = async (studyGroup) => {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    const message = `A new study group has been created: *${studyGroup.title}* - ${studyGroup.description}`;
    
    await axios.post(slackWebhookUrl, { text: message });
};

// Function to notify members on Discord
const notifyDiscord = async (studyGroup) => {
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    const message = `A new study group has been created: **${studyGroup.title}** - ${studyGroup.description}`;
    
    await axios.post(discordWebhookUrl, { content: message });
};

// Add study group resources
exports.addStudyGroupResources = async (req, res) => {
    const { id } = req.params;
    const { resources } = req.body;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        studyGroup.resources.push(...resources);
        await studyGroup.save();

        res.status(200).json({ message: 'Resources added successfully', resources: studyGroup.resources });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add resources', details: error.message });
    }
};

// Get study group resources
exports.getStudyGroupResources = async (req, res) => {
    const { id } = req.params;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        res.status(200).json(studyGroup.resources);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve resources', details: error.message });
    }
};

// Create polls for study group decisions
exports.createPoll = async (req, res) => {
    const { id } = req.params;
    const { question, options } = req.body;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        const poll = { question, options, votes: {} };
        studyGroup.polls.push(poll);
        await studyGroup.save();

        res.status(200).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create poll', details: error.message });
    }
};

// Get all polls for a study group
exports.getPolls = async (req, res) => {
    const { id } = req.params;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        res.status(200).json(studyGroup.polls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve polls', details: error.message });
    }
};

// Vote on a poll
exports.voteOnPoll = async (req, res) => {
    const { id, pollIndex } = req.params;
    const { userId, option } = req.body;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        const poll = studyGroup.polls[pollIndex];
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        if (!poll.votes[userId]) {
            poll.votes[userId] = option;
            await studyGroup.save();
            res.status(200).json({ message: 'Vote recorded successfully', poll });
        } else {
            res.status(400).json({ error: 'User has already voted' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to vote on poll', details: error.message });
    }
};

// Get poll results
exports.getPollResults = async (req, res) => {
    const { id, pollIndex } = req.params;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        const poll = studyGroup.polls[pollIndex];
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        res.status(200).json({ question: poll.question, votes: poll.votes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get poll results', details: error.message });
    }
};

// Archive study groups after inactivity
exports.archiveStudyGroup = async (req, res) => {
    const { id } = req.params;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        studyGroup.archived = true;
        await studyGroup.save();

        res.status(200).json({ message: 'Study group archived successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to archive study group', details: error.message });
    }
};

// Unarchive study groups
exports.unarchiveStudyGroup = async (req, res) => {
    const { id } = req.params;

    try {
        const studyGroup = await StudyGroup.findById(id);
        if (!studyGroup) return res.status(404).json({ error: 'Study group not found' });

        studyGroup.archived = false;
        await studyGroup.save();

        res.status(200).json({ message: 'Study group unarchived successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unarchive study group', details: error.message });
    }
};

// Get archived study groups
exports.getArchivedStudyGroups = async (req, res) => {
    try {
        const archivedGroups = await StudyGroup.find({ archived: true });
        res.status(200).json(archivedGroups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve archived study groups', details: error.message });
    }
};

