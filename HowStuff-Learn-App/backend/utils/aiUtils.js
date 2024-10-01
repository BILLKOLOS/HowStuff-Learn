const axios = require('axios');

const generateContentWithAI = async (query, userLevel) => {
    try {
        const response = await axios.post('AI_SERVICE_ENDPOINT', {
            query,
            userLevel,
        });
        return response.data; // Assuming the AI returns useful educational content
    } catch (error) {
        console.error('Error generating AI content:', error);
        throw new Error('AI content generation failed');
    }
};

module.exports = { generateContentWithAI };
