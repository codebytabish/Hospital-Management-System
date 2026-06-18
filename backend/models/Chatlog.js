const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatLogSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema],
    aiResult: {
      likelyCause: String,
      urgency: { type: String, enum: ["low", "moderate", "high", "emergency"] },
      suggestedSpecialist: String,
      advice: String,
    },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatLog", chatLogSchema);