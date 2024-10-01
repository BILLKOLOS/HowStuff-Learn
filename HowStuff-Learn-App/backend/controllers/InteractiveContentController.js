const InteractiveContent = require('../models/InteractiveContent');

// Create interactive content
exports.createInteractiveContent = async (req, res) => {
    const { title, description, contentUrl, subject, gradeLevel, tags, difficultyLevel } = req.body;

    try {
        const interactiveContent = new InteractiveContent({
            title,
            description,
            contentUrl,
            subject,
            gradeLevel,
            tags,
            difficultyLevel,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await interactiveContent.save();
        res.status(201).json({ message: 'Interactive content created successfully', interactiveContent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create interactive content', details: error.message });
    }
};

// Retrieve interactive content based on filters
exports.getInteractiveContent = async (req, res) => {
    const { subject, gradeLevel, tags, difficultyLevel } = req.query;

    try {
        const query = {};
        if (subject) query.subject = subject;
        if (gradeLevel) query.gradeLevel = gradeLevel;
        if (tags) query.tags = { $in: tags.split(',') }; // Filter by tags
        if (difficultyLevel) query.difficultyLevel = difficultyLevel; // Filter by difficulty

        const content = await InteractiveContent.find(query);
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve interactive content', details: error.message });
    }
};

// Update existing interactive content
exports.updateInteractiveContent = async (req, res) => {
    const { id } = req.params;
    const { title, description, contentUrl, subject, gradeLevel, tags, difficultyLevel } = req.body;

    try {
        const interactiveContent = await InteractiveContent.findByIdAndUpdate(
            id,
            { title, description, contentUrl, subject, gradeLevel, tags, difficultyLevel, updatedAt: new Date() },
            { new: true }
        );

        if (!interactiveContent) return res.status(404).json({ error: 'Interactive content not found' });

        res.status(200).json({ message: 'Interactive content updated successfully', interactiveContent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update interactive content', details: error.message });
    }
};

// Delete interactive content
exports.deleteInteractiveContent = async (req, res) => {
    const { id } = req.params;

    try {
        const interactiveContent = await InteractiveContent.findByIdAndDelete(id);
        if (!interactiveContent) return res.status(404).json({ error: 'Interactive content not found' });

        res.status(200).json({ message: 'Interactive content deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete interactive content', details: error.message });
    }
};

// Get content usage analytics
exports.getContentUsageAnalytics = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await InteractiveContent.findById(id);
        if (!content) return res.status(404).json({ error: 'Interactive content not found' });

        // Placeholder for analytics logic
        const usageData = {}; // Replace with actual usage data

        res.status(200).json({ message: 'Usage analytics retrieved', usageData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve usage analytics', details: error.message });
    }
};

// Rate interactive content
exports.rateInteractiveContent = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    try {
        const content = await InteractiveContent.findById(id);
        if (!content) return res.status(404).json({ error: 'Interactive content not found' });

        content.ratings.push(rating);
        await content.save();

        res.status(200).json({ message: 'Rating added successfully', averageRating: calculateAverageRating(content.ratings) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add rating', details: error.message });
    }
};

// Get average rating of interactive content
exports.getAverageRating = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await InteractiveContent.findById(id);
        if (!content) return res.status(404).json({ error: 'Interactive content not found' });

        const averageRating = calculateAverageRating(content.ratings);
        res.status(200).json({ averageRating });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve average rating', details: error.message });
    }
};

// Add comments to interactive content
exports.addComment = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    try {
        const content = await InteractiveContent.findById(id);
        if (!content) return res.status(404).json({ error: 'Interactive content not found' });

        content.comments.push({ text: comment, createdAt: new Date() });
        await content.save();

        res.status(200).json({ message: 'Comment added successfully', comments: content.comments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment', details: error.message });
    }
};

// Get comments for interactive content
exports.getComments = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await InteractiveContent.findById(id);
        if (!content) return res.status(404).json({ error: 'Interactive content not found' });

        res.status(200).json(content.comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments', details: error.message });
    }
};

// Helper function to calculate average rating
const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length;
};

// Get all interactive content for a specific subject
exports.getAllContentBySubject = async (req, res) => {
    const { subject } = req.params;

    try {
        const content = await InteractiveContent.find({ subject });
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve content', details: error.message });
    }
};

// Get trending interactive content based on views or ratings
exports.getTrendingContent = async (req, res) => {
    try {
        const content = await InteractiveContent.find().sort({ views: -1 }).limit(5); // Example: get top 5 trending content
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trending content', details: error.message });
    }
};

