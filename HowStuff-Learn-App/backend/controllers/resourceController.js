// Import all services dynamically from apiServices
const services = require('../utils/apiServices');

// Helper function to dynamically call service methods
const callServiceMethod = async (service, method, topic) => {
    if (service && typeof service[method] === 'function') {
        try {
            return await service[method](topic);
        } catch (error) {
            console.error(`Error fetching from ${service.constructor.name}:`, error);
            return { error: `Failed to fetch from ${service.constructor.name}` };
        }
    }
    return null;
};

// Controller to fetch resources from all available services
const getGeneralResources = async (req, res) => {
    try {
        const { topic } = req.query;

        // Validate the input
        if (!topic || typeof topic !== 'string') {
            return res.status(400).json({ message: 'Invalid topic provided.' });
        }

        // Dynamically collect results from all services
        const results = {};
        for (const [serviceName, service] of Object.entries(services)) {
            // Check if the service has a standard method for fetching resources
            let result = await callServiceMethod(service, 'getResources', topic);
            if (!result) {
                // Try an alternative method (e.g., 'askQuestion')
                result = await callServiceMethod(service, 'askQuestion', topic);
            }

            // Only store valid results
            if (result) {
                results[serviceName] = result;
            }
        }

        // Return the combined results from all services
        res.status(200).json({
            success: true,
            topic,
            results,
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: 'Failed to fetch resources.' });
    }
};

// Export all controller methods
module.exports = {
    getGeneralResources
};
