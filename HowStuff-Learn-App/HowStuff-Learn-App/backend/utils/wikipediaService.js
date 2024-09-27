const axios = require('axios');

exports.getArticle = async (query) => {
    try {
        const response = await axios.get('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                format: 'json',
                list: 'search',
                srsearch: query,
                srlimit: 5, // Limit the number of results
            },
        });

        return response.data.query.search;
    } catch (error) {
        throw new Error(`Error fetching Wikipedia content: ${error.message}`);
    }
};
