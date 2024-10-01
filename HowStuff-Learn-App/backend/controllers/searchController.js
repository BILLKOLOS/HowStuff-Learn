const OpenAI = require('../utils/openaiService');
const VideoService = require('../utils/videoService');
const WikipediaService = require('../utils/wikipediaService');
const KhanAcademyService = require('../utils/khanAcademyService');
const filterContentByEducationLevel = require('../utils/determineEducationLevel');

const searchQuery = async (req, res) => {
    const { query, educationLevel } = req.body;

    let openAIResponse, videoResponse, wikiResponse, khanResponse;

    try {
        // Fetch text content from OpenAI
        openAIResponse = await OpenAI.generateText(query, educationLevel);
    } catch (error) {
        console.error('Error fetching OpenAI content:', error.message);
    }

    try {
        // Fetch video content (YouTube, Vimeo, etc.)
        videoResponse = await VideoService.getVideo(query);
    } catch (error) {
        console.error('Error fetching video content:', error.message);
    }

    try {
        // Fetch Wikipedia content
        wikiResponse = await WikipediaService.getArticle(query);
    } catch (error) {
        console.error('Error fetching Wikipedia content:', error.message);
    }

    try {
        // Fetch Khan Academy content
        khanResponse = await KhanAcademyService.getContent(query);
    } catch (error) {
        console.error('Error fetching Khan Academy content:', error.message);
    }

    // Filter content based on education level
    const filteredText = openAIResponse ? filterContentByEducationLevel(openAIResponse, educationLevel) : null;
    const filteredVideo = videoResponse ? filterContentByEducationLevel(videoResponse, educationLevel) : null;
    const filteredWiki = wikiResponse ? filterContentByEducationLevel(wikiResponse, educationLevel) : null;
    const filteredKhan = khanResponse ? filterContentByEducationLevel(khanResponse, educationLevel) : null;

    res.status(200).json({
        text: filteredText,
        video: filteredVideo,
        wikipedia: filteredWiki,
        khanAcademy: filteredKhan
    });
};

module.exports = { searchQuery };
