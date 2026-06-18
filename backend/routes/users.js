const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getDoctors,
  createDoctor,
  updateDoctorProfile,
  updateMyProfile,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", authorizeRoles("admin"), getAllUsers);
router.put("/me", updateMyProfile);
router.get("/doctors", getDoctors);
router.post("/doctors", authorizeRoles("admin"), createDoctor);
router.put("/doctors/:id", authorizeRoles("admin"), updateDoctorProfile);
router.delete("/:id", authorizeRoles("admin"), deleteUser);

module.exports = router;