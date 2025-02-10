const services = require('../utils/apiService');
const axios = require('axios');

const WOLFRAM_APP_ID = 'KJT7V4-V2VJE3Q338'; // Wolfram Alpha API Key

// Define the search controller
const searchController = {
    async search(req, res) {
        try {
            const { query } = req.query;

            if (!query || typeof query !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid search query.',
                });
            }

            const results = {};

            // Parallel execution of service searches
            const servicePromises = Object.entries(services).map(async ([serviceName, service]) => {
                if (typeof service.search !== 'function') {
                    return { serviceName, success: false, message: `Service ${serviceName} has no search method.` };
                }

                try {
                    const serviceResults = await service.search(query);
                    return { serviceName, success: true, data: serviceResults };
                } catch (error) {
                    console.error(`Error searching with ${serviceName}:`, error);
                    return { serviceName, success: false, message: error.message || 'Error retrieving data.' };
                }
            });

            // Wolfram Alpha API Call
            const wolframPromise = axios
                .get('https://api.wolframalpha.com/v2/query', {
                    params: {
                        input: query,
                        appid: WOLFRAM_APP_ID,
                        format: 'plaintext',
                        output: 'json',
                    },
                })
                .then(response => {
                    const pods = response.data.queryresult.pods || [];
                    return {
                        serviceName: 'wolfram_alpha',
                        success: true,
                        data: pods
                            .map(pod => ({
                                title: pod.title,
                                subpods: pod.subpods.map(sub => sub.plaintext).filter(Boolean),
                            }))
                            .filter(pod => pod.subpods.length > 0),
                    };
                })
                .catch(error => {
                    console.error('Error fetching data from Wolfram Alpha:', error);
                    return { serviceName: 'wolfram_alpha', success: false, message: 'Error retrieving Wolfram Alpha data.' };
                });

            // Execute all API calls in parallel
            const serviceResults = await Promise.allSettled([...servicePromises, wolframPromise]);

            // Store the results in a structured format
            serviceResults.forEach(result => {
                if (result.status === 'fulfilled') {
                    results[result.value.serviceName] = {
                        success: result.value.success,
                        data: result.value.data || null,
                        message: result.value.message || null,
                    };
                } else {
                    results[result.reason.serviceName] = {
                        success: false,
                        message: result.reason.message || 'Unknown error',
                    };
                }
            });

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
