const express = require("express");
const router = express.Router();
const { checkSymptoms, getChatHistory } = require("../controllers/aiController");
const { protect, authorizeRoles } = require("../middleware/auth");
const ChatLog = require("../models/ChatLog");

router.use(protect);

router.post("/symptom-check", authorizeRoles("patient"), checkSymptoms);
router.get("/history", authorizeRoles("patient"), getChatHistory);

// Doctor/admin views a specific patient's symptom history
router.get("/history/:patientId", authorizeRoles("doctor", "admin"), async (req, res) => {
  try {
    const logs = await ChatLog.find({ patient: req.params.patientId })
      .populate("patient", "name email")
      .sort({ createdAt: -1 })
      .limit(20)
    res.json({ success: true, logs })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;