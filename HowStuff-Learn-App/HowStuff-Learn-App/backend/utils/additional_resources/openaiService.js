const axios = require('axios');

exports.generateText = async (query, educationLevel) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: query }],
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        throw new Error(`Error generating text from OpenAI: ${error.message}`);
    }
};
