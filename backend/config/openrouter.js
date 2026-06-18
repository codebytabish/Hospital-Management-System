const OpenAI = require("openai");

let client;

const getAIClient = () => {
  if (!client) {
    client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  return client;
};

module.exports = { getAIClient };