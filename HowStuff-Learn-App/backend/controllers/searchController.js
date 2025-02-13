const services = require("../utils/apiService");
const axios = require("axios");

const WOLFRAM_APP_ID = "KJT7V4-LLW2VJ6P7E"; // Wolfram Alpha API Key
const HF_API_KEY = "your_huggingface_api_key"; // Hugging Face API Key
const OPENAI_API_KEY = "your_openai_api_key"; // OpenAI API Key
const DEEPAI_API_KEY = "0806d72a-34d8-4fbe-a298-110fbca208f9"; // DeepAI API Key
const TOGETHER_AI_API_KEY = "36c79322c44cf4abbab93c764a48af33262b8087c7d78706536ae6ac632ce9a4"; // Together AI API Key

async function generateLottieAnimation(bestAnswer) {
  if (!bestAnswer) return null;

  try {
    // ✅ 1. Try Google Gemini API
    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      { contents: [{ parts: [{ text: `Create a Lottie JSON animation script for: ${bestAnswer}` }] }] },
      { params: { key: process.env.GOOGLE_GEMINI_API_KEY } }
    );

    let rawAnimation = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    if (rawAnimation) {
      rawAnimation = rawAnimation.replace(/```json|```/g, "").trim();
      return JSON.parse(rawAnimation);
    }
  } catch (error) {
    console.warn("❌ Gemini failed. Trying Hugging Face:", error.message);
  }

  try {
    // ✅ 2. Try Hugging Face (Llama 2)
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat",
      { inputs: `Generate a JSON object for a Lottie animation of: ${bestAnswer}` },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );
    return JSON.parse(hfResponse.data.generated_text);
  } catch (hfError) {
    console.warn("❌ Hugging Face failed. Trying OpenAI:", hfError.message);
  }

  try {
    // ✅ 3. Try OpenAI GPT-4
    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: `Generate a Lottie JSON animation for: ${bestAnswer}` }],
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
    );

    return JSON.parse(openAiResponse.data.choices[0].message.content);
  } catch (openAiError) {
    console.warn("❌ OpenAI failed. Trying DeepAI:", openAiError.message);
  }

  try {
    // ✅ 4. Try DeepAI's Text Generation API
    const deepAiResponse = await axios.post(
      "https://api.deepai.org/api/text-generator",
      { text: `Generate a Lottie JSON animation script for: ${bestAnswer}` },
      { headers: { "api-key": DEEPAI_API_KEY } }
    );

    return JSON.parse(deepAiResponse.data.output);
  } catch (deepAiError) {
    console.warn("❌ DeepAI failed. Trying Together AI:", deepAiError.message);
  }

  try {
    // ✅ 5. Try Together AI (Llama 2)
    const togetherAiResponse = await axios.post(
      "https://api.together.xyz/v1/completions",
      {
        model: "togethercomputer/llama-2-7b-chat",
        prompt: `Generate a Lottie JSON animation script for: ${bestAnswer}`,
        max_tokens: 500,
      },
      { headers: { Authorization: `Bearer ${TOGETHER_AI_API_KEY}`, "Content-Type": "application/json" } }
    );

    return JSON.parse(togetherAiResponse.data.choices[0].text);
  } catch (togetherAiError) {
    console.error("❌ All AI services failed:", togetherAiError.message);
    return null;
  }
}

const searchController = {
  async search(req, res) {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ success: false, message: "Invalid search query." });
      }

      const results = {};

      // Parallel execution of service searches
      const servicePromises = Object.entries(services).map(async ([serviceName, service]) => {
        if (typeof service.search !== "function") {
          return { serviceName, success: false, message: `Service ${serviceName} has no search method.` };
        }
        try {
          const serviceResults = await service.search(query);
          return { serviceName, success: true, data: serviceResults };
        } catch (error) {
          console.error(`Error searching with ${serviceName}:`, error);
          return { serviceName, success: false, message: error.message || "Error retrieving data." };
        }
      });

      // Wolfram Alpha API Call
      const wolframPromise = axios
        .get("https://api.wolframalpha.com/v2/query", {
          params: { input: query, appid: WOLFRAM_APP_ID, format: "plaintext", output: "json" },
        })
        .then((response) => {
          const pods = response.data?.queryresult?.pods || [];
          return {
            serviceName: "wolfram_alpha",
            success: true,
            data: pods.map((pod) => ({
              title: pod.title,
              subpods: pod.subpods.map((sub) => sub.plaintext).filter(Boolean),
            })).filter((pod) => pod.subpods.length > 0),
          };
        })
        .catch((error) => {
          console.error("Error fetching data from Wolfram Alpha:", error);
          return { serviceName: "wolfram_alpha", success: false, message: "Error retrieving Wolfram Alpha data." };
        });

      // Execute all API calls in parallel
      const serviceResults = await Promise.allSettled([...servicePromises, wolframPromise]);

      // Store the results in a structured format
      let bestAnswer = null;
      serviceResults.forEach((result) => {
        if (result.status === "fulfilled") {
          results[result.value.serviceName] = {
            success: result.value.success,
            data: result.value.data || null,
            message: result.value.message || null,
          };

          if (!bestAnswer && result.value.success && Array.isArray(result.value.data) && result.value.data.length > 0) {
            bestAnswer = result.value.data[0]?.subpods?.join(", ") || result.value.data[0]?.title;
          }
        } else {
          results[result.reason?.serviceName || "unknown_service"] = {
            success: false,
            message: result.reason?.message || "Unknown error",
          };
        }
      });

      // Generate Lottie Animation with fallback system
      let animationJSON = await generateLottieAnimation(bestAnswer);

      return res.status(200).json({
        success: true,
        query,
        results,
        animation: animationJSON,
      });
    } catch (error) {
      console.error("Error in searchController:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
};

module.exports = searchController;
