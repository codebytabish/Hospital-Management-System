const express = require("express");
const router = express.Router();
const { createPrescription, getMyPrescriptions, getPrescription } = require("../controllers/prescriptionController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.use(protect);

router.post("/", authorizeRoles("doctor"), createPrescription);
router.get("/", getMyPrescriptions);
router.get("/:id", getPrescription);

module.exports = router;