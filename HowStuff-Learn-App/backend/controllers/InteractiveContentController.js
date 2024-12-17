const InteractiveContent = require('../models/InteractiveContent');


// Create interactive content
const createInteractiveContent = async (req, res) => {
    // Log the request body to verify the data being passed
    console.log('Received request body:', req.body);

    const { title, description, contentType, url, learningModule, createdBy, tags, duration, difficultyLevel, learningObjectives } = req.body;

    try {
        const interactiveContent = new InteractiveContent({
            title,
            description,
            contentType,
            url,
            learningModule,
            createdBy,
            tags,
            duration,
            difficultyLevel,
            learningObjectives,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await interactiveContent.save();
        res.status(201).json({ message: 'Interactive content created successfully', interactiveContent });
    } catch (error) {
        console.error('Error saving interactive content:', error);

        // Log specific fields that failed validation
        if (error.errors) {
            for (let key in error.errors) {
                console.error(`${key}:`, error.errors[key].message);
            }
        }

        res.status(400).json({ error: 'Failed to create interactive content', details: error.message });
    }
};



// Retrieve interactive content based on filters
const getInteractiveContent = async (req, res) => {
    const { subject, gradeLevel, tags, difficultyLevel } = req.query;

    try {
        const query = {};
        if (subject) query.subject = subject;
        if (gradeLevel) query.gradeLevel = gradeLevel;
        if (tags) query.tags = { $in: tags.split(',') };
        if (difficultyLevel) query.difficultyLevel = difficultyLevel;

        const content = await InteractiveContent.find(query);
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve interactive content', details: error.message });
    }
};

// Update existing interactive content
const updateInteractiveContent = async (req, res) => {
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
const deleteInteractiveContent = async (req, res) => {
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
const getContentUsageAnalytics = async (req, res) => {
    const { id } = req.params;

    try {
        const content = await InteractiveContent.findById(id);
        if (!content) return res.status(404).json({ error: 'Interactive content not found' });

        const usageData = {}; // Placeholder for analytics logic
        res.status(200).json({ message: 'Usage analytics retrieved', usageData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve usage analytics', details: error.message });
    }
};

// Rate interactive content
const rateInteractiveContent = async (req, res) => {
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
const getAverageRating = async (req, res) => {
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
const addComment = async (req, res) => {
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
const getComments = async (req, res) => {
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
const getAllContentBySubject = async (req, res) => {
    const { subject } = req.params;

    try {
        const content = await InteractiveContent.find({ subject });
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve content', details: error.message });
    }
};

// Get trending interactive content based on views or ratings
const getTrendingContent = async (req, res) => {
    try {
        const content = await InteractiveContent.find().sort({ views: -1 }).limit(5);
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve trending content', details: error.message });
    }
};

module.exports = {
    createInteractiveContent,
    getInteractiveContent,
    updateInteractiveContent,
    deleteInteractiveContent,
    getContentUsageAnalytics,
    rateInteractiveContent,
    getAverageRating,
    addComment,
    getComments,
    getAllContentBySubject,
    getTrendingContent,
};
