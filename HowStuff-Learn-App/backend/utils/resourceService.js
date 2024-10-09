const axios = require('axios');
const OpenAI = require('openai');
const { API_KEY, WIKIPEDIA_API_URL, KHAN_ACADEMY_API_URL } = process.env;

// OpenAI API client setup
const openai = new OpenAI({
    apiKey: API_KEY,
});

// Function to fetch resources from OpenAI API
async function fetchFromOpenAI(query) {
    try {
        const response = await openai.Completion.create({
            model: "text-davinci-003",
            prompt: query,
            max_tokens: 500,
        });
        return response.choices[0].text.trim();
    } catch (error) {
        console.error('Error fetching from OpenAI:', error);
        throw new Error('Failed to fetch data from OpenAI');
    }
}

// Function to fetch resources from Wikipedia API
async function fetchFromWikipedia(query) {
    const url = `${WIKIPEDIA_API_URL}?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        const searchResults = response.data.query.search;
        return searchResults.length > 0 ? searchResults[0].snippet : 'No Wikipedia results found.';
    } catch (error) {
        console.error('Error fetching from Wikipedia:', error);
        throw new Error('Failed to fetch data from Wikipedia');
    }
}

// Function to fetch resources from Khan Academy API
async function fetchFromKhanAcademy(query) {
    const url = `${KHAN_ACADEMY_API_URL}?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        const results = response.data.results;
        return results.length > 0 ? results : 'No Khan Academy results found.';
    } catch (error) {
        console.error('Error fetching from Khan Academy:', error);
        throw new Error('Failed to fetch data from Khan Academy');
    }
}

// Function to fetch all resources
async function fetchResources(query) {
    try {
        const openAIResult = await fetchFromOpenAI(query);
        const wikipediaResult = await fetchFromWikipedia(query);
        const khanAcademyResult = await fetchFromKhanAcademy(query);

        return {
            openAIResult,
            wikipediaResult,
            khanAcademyResult,
        };
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw error;
    }
}

module.exports = {
    fetchFromOpenAI,
    fetchFromWikipedia,
    fetchFromKhanAcademy,
    fetchResources,
};
