const express = require("express");
const router = express.Router();
const { checkSymptoms, getChatHistory } = require("../controllers/aiController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.use(protect);

router.post("/symptom-check", authorizeRoles("patient"), checkSymptoms);
router.get("/history", authorizeRoles("patient"), getChatHistory);

module.exports = router;