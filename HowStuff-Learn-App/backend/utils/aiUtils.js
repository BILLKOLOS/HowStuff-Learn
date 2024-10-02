const axios = require('axios');

// Load the AI service endpoint from environment variables
const AI_SERVICE_ENDPOINT = process.env.AI_SERVICE_ENDPOINT || 'https://default-ai-service-endpoint.com/generate';

// Define user levels according to the educational stages
const USER_LEVELS = {
    KINDERGARTEN: 'kindergarten',
    PRIMARY: 'primary',
    JUNIOR_SECONDARY: 'junior secondary',
    HIGH_SCHOOL: 'high school',
    COLLEGE: 'college',
    UNIVERSITY: 'university',
    SPECIALIZED: 'specialized education',
};

// Function to validate the user level
const isValidUserLevel = (level) => {
    return Object.values(USER_LEVELS).includes(level);
};

const generateContentWithAI = async (query, userLevel) => {
    try {
        // Validate the user level before making the request
        if (!isValidUserLevel(userLevel)) {
            throw new Error(`Invalid user level: ${userLevel}. Valid levels are: ${Object.values(USER_LEVELS).join(', ')}`);
        }

        const response = await axios.post(AI_SERVICE_ENDPOINT, {
            query,
            userLevel,
        }, {
            timeout: 5000, // Set a timeout of 5 seconds
        });

        // Validate the response
        if (response.data && response.data.content) {
            return response.data.content; // Assuming the AI returns a 'content' field
        } else {
            throw new Error('Invalid response format from AI service.');
        }
    } catch (error) {
        console.error('Error generating AI content:', error.message);

        // Differentiate between errors based on error type
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error in setup:', error.message);
        }

        throw new Error('AI content generation failed');
    }
};

// Export the generateContentWithAI function and user levels
module.exports = {
    generateContentWithAI,
    USER_LEVELS,
};
