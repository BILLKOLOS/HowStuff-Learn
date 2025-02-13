const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

const animationController = {
    async generateAnimation(req, res) {
        try {
            const { answer } = req.body;

            if (!answer) {
                return res.status(400).json({ success: false, message: 'Answer is required' });
            }

            // Generate Lottie JSON using OpenAI
            const openaiResponse = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [{ role: "user", content: `Create a Lottie JSON animation script for: ${answer}` }],
            });

            const animationJSON = openaiResponse.data.choices[0].message.content;

            res.json({ success: true, animation: JSON.parse(animationJSON) });
        } catch (error) {
            console.error('Error generating animation:', error);
            res.status(500).json({ success: false, message: 'Error generating animation' });
        }
    },
};

module.exports = animationController;
