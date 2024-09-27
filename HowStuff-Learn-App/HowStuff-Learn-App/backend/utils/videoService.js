const axios = require('axios');

exports.getVideo = async (query) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 5,
                key: process.env.YOUTUBE_API_KEY, // YouTube Data API key from environment variables
            },
        });

        return response.data.items;
    } catch (error) {
        throw new Error(`Error fetching video content: ${error.message}`);
    }
};
