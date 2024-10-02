// Import necessary modules
const Content = require('../models/Content');
const User = require('../models/User'); // Import User model for role management
const { fetchExternalResources } = require('../utils/apiServices');
const { logEngagementData, getRecommendations } = require('../utils/aiUtils');
const { formatContentList, generateContentWithAI } = require('../utils/formattingUtils'); // Updated to include generateContentWithAI

// Create new educational content
exports.createContent = async (req, res) => {
    const { title, description, type, contentLink, subject, grade } = req.body;

    try {
        // Fetch additional resources from external APIs
        const additionalResources = await fetchExternalResources(subject);

        // Adjust content for user level before saving (example: default to primary if user not specified)
        const userLevel = req.user.level || 'primary'; // Assuming user level is available
        const enhancedDescription = await generateContentWithAI(description, userLevel); // Adjust content using AI

        const newContent = new Content({
            title,
            description: enhancedDescription, // Use enhanced content
            type,
            contentLink,
            subject,
            grade,
            creator: req.user.id,
            version: 1, // Initialize versioning
            additionalResources, // Attach additional resources
        });

        await newContent.save();
        res.status(201).json({ message: 'Content created successfully', content: newContent });
    } catch (error) {
        res.status(500).json({ message: 'Error creating content', error: error.message });
    }
};

// Retrieve educational content with optional search, filtering, and pagination
exports.getContent = async (req, res) => {
    const { subject, grade, search, type, userLevel, page = 1, limit = 10 } = req.query;
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

        // Adjust content for user level
        const adjustedContentList = await Promise.all(contentList.map(async (content) => {
            const adjustedDescription = await generateContentWithAI(content.description, userLevel);
            return { ...content.toObject(), description: adjustedDescription }; // Update the description with adjusted content
        }));

        const formattedContentList = formatContentList(adjustedContentList); // Format the list

        res.status(200).json({
            totalContent,
            totalPages: Math.ceil(totalContent / limit),
            currentPage: Number(page),
            contentList: formattedContentList,
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

        // Adjust the description for user level before saving
        const userLevel = req.user.level || 'primary'; // Assuming user level is available
        content.description = await generateContentWithAI(description, userLevel);
        
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

        // Log engagement data for AI analysis
        await logEngagementData({ userId: req.user.id, contentId });

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

        // Get AI-enhanced recommendations
        const recommendations = await getRecommendations(content.subject, contentId);

        res.status(200).json({ recommendations });
    } catch (error) {
        res.status(500).json({ message: 'Error recommending content', error: error.message });
    }
};
