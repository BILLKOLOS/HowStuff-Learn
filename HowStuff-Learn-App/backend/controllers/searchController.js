const services = require('../utils/apiServices');
const axios = require('axios');

const WOLFRAM_APP_ID = 'KJT7V4-762WRXLHKK'; // Wolfram Alpha API Key

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
                    if (typeof service.search !== 'function') {
                        throw new Error(`Service ${serviceName} does not have a search method.`);
                    }

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

            // Wolfram Alpha API Call (Short Answers API)
            try {
                const wolframResponse = await axios.get(`https://api.wolframalpha.com/v1/result`, {
                    params: {
                        i: query,
                        appid: WOLFRAM_APP_ID,
                    },
                });

                results['wolfram_alpha'] = {
                    success: true,
                    data: wolframResponse.data,
                };
            } catch (wolframError) {
                console.error('Error fetching data from Wolfram Alpha:', wolframError);
                results['wolfram_alpha'] = {
                    success: false,
                    message: 'Error retrieving Wolfram Alpha data.',
                };
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
