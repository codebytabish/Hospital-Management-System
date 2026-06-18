const { getAIClient } = require("../config/openrouter");
const ChatLog = require("../models/ChatLog");

const SYSTEM_PROMPT = `You are SynaptoClin  AI, a medical triage assistant.
When a patient describes symptoms, respond ONLY with a valid JSON object in this exact format:
{
  "likelyCause": "string",
  "urgency": "low" | "moderate" | "high" | "emergency",
  "suggestedSpecialist": "string",
  "advice": "string (2-3 sentences of general guidance, always remind this is not professional medical advice)"
}
Never include markdown, code blocks, or any text outside the JSON.`;

// @desc  Analyze symptoms with AI
// @route POST /api/ai/symptom-check
const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || symptoms.trim().length < 5) {
      return res.status(400).json({ message: "Please describe your symptoms" });
    }

    const client = getAIClient();

    const completion = await client.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Patient symptoms: "${symptoms}"` },
      ],
    });

    const raw = completion.choices[0].message.content.trim();

    let aiResult;
    try {
      aiResult = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      aiResult = match
        ? JSON.parse(match[0])
        : { error: "Could not parse AI response" };
    }

    const chatLog = await ChatLog.create({
      patient: req.user._id,
      messages: [
        { role: "user", content: symptoms },
        { role: "ai", content: JSON.stringify(aiResult) },
      ],
      aiResult,
    });

    res.json({ chatLogId: chatLog._id, result: aiResult });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get patient's chat history
// @route GET /api/ai/history
const getChatHistory = async (req, res) => {
  try {
    const logs = await ChatLog.find({ patient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { checkSymptoms, getChatHistory };