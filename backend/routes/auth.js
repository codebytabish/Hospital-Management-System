const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const { login } = require("../controllers/authController");
const Appointment = require("../models/Appointment");


router.post("/register", register);
router.post("/login", login);




module.exports = router;