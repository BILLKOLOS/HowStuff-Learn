// Import necessary modules
const Content = require('../models/Content');
const User = require('../models/User'); // Import User model for role management

// Create new educational content
exports.createContent = async (req, res) => {
    const { title, description, type, contentLink, subject, grade } = req.body;

    try {
        const newContent = new Content({
            title,
            description,
            type,
            contentLink,
            subject,
            grade,
            creator: req.user.id,
            version: 1, // Initialize versioning
        });

        await newContent.save();
        res.status(201).json({ message: 'Content created successfully', content: newContent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating content', error: error.message });
    }
};

// Retrieve educational content with optional search, filtering, and pagination
exports.getContent = async (req, res) => {
    const { subject, grade, search, type, page = 1, limit = 10 } = req.query;
    const query = {};

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (type) query.type = type;
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    try {
        const totalContent = await Content.countDocuments(query);
        const contentList = await Content.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            totalContent,
            totalPages: Math.ceil(totalContent / limit),
            currentPage: Number(page),
            contentList,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving content', error: error.message });
    }
};

// Update existing content with versioning
exports.updateContent = async (req, res) => {
    const { contentId } = req.params;
    const { title, description, type, contentLink, subject, grade } = req.body;

    try {
        const content = await Content.findById(contentId);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        // Increment version
        content.version += 1;
        content.title = title;
        content.description = description;
        content.type = type;
        content.contentLink = contentLink;
        content.subject = subject;
        content.grade = grade;

        await content.save();
        res.status(200).json({ message: 'Content updated successfully', content });
    } catch (error) {
        res.status(500).json({ message: 'Error updating content', error: error.message });
    }
};

// Soft delete content
exports.softDeleteContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        const updatedContent = await Content.findByIdAndUpdate(contentId, { isActive: false }, { new: true });
        if (!updatedContent) return res.status(404).json({ message: 'Content not found' });

        res.status(200).json({ message: 'Content soft deleted successfully', content: updatedContent });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting content', error: error.message });
    }
};

// Track content engagement
exports.trackContentEngagement = async (req, res) => {
    const { contentId } = req.params;

    try {
        const content = await Content.findById(contentId);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        content.engagements.push({ userId: req.user.id, timestamp: new Date() }); // Assuming engagements is an array in Content
        await content.save();

        res.status(200).json({ message: 'Engagement tracked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error tracking engagement', error: error.message });
    }
};

// Recommend related content
exports.recommendContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        const content = await Content.findById(contentId);
        if (!content) return res.status(404).json({ message: 'Content not found' });

        const recommendations = await Content.find({
            subject: content.subject,
            _id: { $ne: contentId } // Exclude the current content
        }).limit(5); // Get top 5 related content

        res.status(200).json({ recommendations });
    } catch (error) {
        res.status(500).json({ message: 'Error recommending content', error: error.message });
    }
};

