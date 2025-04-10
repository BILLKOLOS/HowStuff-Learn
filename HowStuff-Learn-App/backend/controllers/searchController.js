// Import necessary services from various directories
const services = require('../utils/apiServices');

// Define the search controller
const searchController = {
    // Search function to handle search queries
    async search(req, res) {
        try {
            const { query } = req.body;

            // Validate the input
            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid search query.',
                });
            }

            // Store results from all services
            const results = {};

            // Iterate through each service and perform the search
            for (const [serviceName, service] of Object.entries(services)) {
                try {
                    // Check if the service has a 'search' method
                    if (typeof service.search !== 'function') {
                        throw new Error(`Service ${serviceName} does not have a search method.`);
                    }

                    // Call the search method and store the results
                    const serviceResults = await service.search(query);
                    results[serviceName] = {
                        success: true,
                        data: serviceResults,
                    };
                } catch (error) {
                    console.error(`Error searching with ${serviceName}:`, error);
                    results[serviceName] = {
                        success: false,
                        message: error.message || 'Error retrieving data.',
                    };
                }
            }

            // Send back the aggregated results
            return res.status(200).json({
                success: true,
                query,
                results,
            });
        } catch (error) {
            console.error('Error in searchController:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    },
};

module.exports = searchController;
