const axios = require('axios');

exports.getArticle = async (query, limit = 5) => {
    try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                format: 'json',
                list: 'search',
                srsearch: query,
                srlimit: limit,
            },
        });

        if (response.data.query && response.data.query.search) {
            return response.data.query.search;
        } else {
            throw new Error('Unexpected response structure from Wikipedia API');
        }
    } catch (error) {
        throw new Error(`Error fetching Wikipedia content: ${error.message}`);
    }
};
