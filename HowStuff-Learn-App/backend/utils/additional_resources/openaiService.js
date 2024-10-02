const axios = require('axios');

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

// Function to validate the education level
const isValidEducationLevel = (level) => {
    return Object.values(USER_LEVELS).includes(level);
};

// Method to generate text using OpenAI's API
exports.generateText = async (query, educationLevel, model = 'gpt-3.5-turbo') => {
    try {
        // Validate the education level before making the request
        if (!isValidEducationLevel(educationLevel)) {
            throw new Error(`Invalid education level: ${educationLevel}. Valid levels are: ${Object.values(USER_LEVELS).join(', ')}`);
        }

        // Customize the query based on the education level
        const customizedQuery = `(${educationLevel}) ${query}`; // Prepend the education level for context

        console.time('OpenAI API call');
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model,
            messages: [{ role: 'user', content: customizedQuery }],
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });
        console.timeEnd('OpenAI API call');

        // Return the generated content from OpenAI
        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response) {
            console.error(`OpenAI API error: ${error.response.status} - ${error.response.data}`);
        } else {
            console.error(`Error generating text from OpenAI: ${error.message}`);
        }
        throw new Error(`Error generating text from OpenAI: ${error.message}`);
    }
};
