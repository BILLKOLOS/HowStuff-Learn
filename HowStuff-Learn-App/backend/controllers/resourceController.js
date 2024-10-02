// Import all services dynamically from apiServices
const services = require('../utils/apiServices');

// Controller to fetch general resources
const getGeneralResources = async (req, res) => {
    try {
        const { topic } = req.query;
        
        // Fetch resources from various services
        const khanAcademy = await services.khanAcademyService.getResources(topic);
        const wikipedia = await services.wikipediaService.getSummary(topic);
        const openaiResponse = await services.openaiService.askQuestion(topic);

        // Combine results into a single response
        const combinedResources = {
            khanAcademy,
            wikipedia,
            openAi: openaiResponse
        };

        res.status(200).json(combinedResources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Failed to fetch resources.' });
    }
};

// Export all controller methods
module.exports = {
    getGeneralResources
};
