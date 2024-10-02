const axios = require('axios');
const { HfInference } = require('@huggingface/inference');

// Load the Hugging Face API key from environment variables
const hf = new HfInference({ apiKey: process.env.HUGGING_FACE_API_KEY });

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

// Function to simplify content using Hugging Face model
const simplifyContent = async (content) => {
    try {
        const response = await hf.text2text("google/flan-t5-small", {
            inputs: content,
            parameters: {
                max_length: 100,
                num_return_sequences: 1,
            }
        });
        return response[0].generated_text; // Return the simplified text
    } catch (error) {
        console.error('Error simplifying content with Hugging Face:', error);
        return content; // Fallback to original content on error
    }
};

// Function to generate text using OpenAI's API
const generateText = async (query) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: query }],
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });

        return response.data.choices[0].message.content; // Return generated content
    } catch (error) {
        console.error(`Error generating text from OpenAI: ${error.message}`);
        throw new Error(`Error generating text from OpenAI: ${error.message}`);
    }
};

// Function to adjust content based on user level
const adjustContentForUserLevel = async (content, userLevel) => {
    let adjustedContents = [];

    switch (userLevel) {
        case USER_LEVELS.KINDERGARTEN:
            adjustedContents.push(await simplifyContent(content)); // Simplify for young learners
            break;
        case USER_LEVELS.PRIMARY:
            adjustedContents.push(await generateText(`Provide relatable examples for: ${content}`));
            break;
        case USER_LEVELS.JUNIOR_SECONDARY:
            adjustedContents.push(await generateText(`Add context for comprehension: ${content}`));
            break;
        case USER_LEVELS.HIGH_SCHOOL:
            adjustedContents.push(await generateText(`Encourage critical thinking for: ${content}`));
            break;
        case USER_LEVELS.COLLEGE:
        case USER_LEVELS.UNIVERSITY:
            adjustedContents.push(await generateText(`Make this research-ready: ${content}`));
            break;
        case USER_LEVELS.SPECIALIZED:
            adjustedContents.push(await generateText(`Provide advanced insights for: ${content}`));
            break;
        default:
            adjustedContents.push(content); // Fallback to original content
            break;
    }

    // Combine results from Hugging Face and OpenAI
    return adjustedContents.join('\n\n'); // Join the contents with a double newline for better readability
};

// Main function to generate content with AI
const generateContentWithAI = async (query, userLevel) => {
    try {
        // Validate the user level before making the request
        if (!isValidUserLevel(userLevel)) {
            throw new Error(`Invalid user level: ${userLevel}. Valid levels are: ${Object.values(USER_LEVELS).join(', ')}`);
        }

        const combinedResponse = await adjustContentForUserLevel(query, userLevel);
        return combinedResponse; // Return the combined content
    } catch (error) {
        console.error('Error generating AI content:', error.message);
        throw new Error('AI content generation failed');
    }
};

// Export the generateContentWithAI function and user levels
module.exports = {
    generateContentWithAI,
    USER_LEVELS,
};
