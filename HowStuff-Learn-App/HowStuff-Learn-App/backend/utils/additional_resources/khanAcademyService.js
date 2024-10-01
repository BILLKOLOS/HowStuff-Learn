const axios = require('axios');

exports.getContent = async (query) => {
    try {
        const response = await axios.get('https://www.khanacademy.org/api/v1/topic', {
            params: { q: query }
        });
        
        // Process response based on Khan Academy API structure
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching Khan Academy content: ${error.message}`);
    }
};
