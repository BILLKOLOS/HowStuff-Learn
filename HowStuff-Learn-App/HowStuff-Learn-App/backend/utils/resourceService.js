const axios = require('axios');

// OpenAI API configuration
const openaiAPIKey = process.env.OPENAI_API_KEY; // Ensure you have this in your environment variables
const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';

// Wikipedia API configuration
const wikipediaEndpoint = 'https://en.wikipedia.org/w/api.php';

// Function to search OpenAI
async function searchOpenAI(query) {
    try {
        const response = await axios.post(openaiEndpoint, {
            model: 'gpt-3.5-turbo', // or your preferred model
            messages: [{ role: 'user', content: query }],
        }, {
            headers: {
                'Authorization': `Bearer ${openaiAPIKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        throw new Error(`OpenAI search error: ${error.message}`);
    }
}

// Function to search Wikipedia
async function searchWikipedia(query) {
    try {
        const response = await axios.get(wikipediaEndpoint, {
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
        throw new Error(`Wikipedia search error: ${error.message}`);
    }
}

// Function to perform combined search
exports.search = async (query) => {
    try {
        const [openAIResult, wikiResults] = await Promise.all([
            searchOpenAI(query),
            searchWikipedia(query),
        ]);

        return {
            openAI: openAIResult,
            wikipedia: wikiResults,
        };
    } catch (error) {
        throw new Error(`Search error: ${error.message}`);
    }
};
