//user/doctor management controlller

const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");

// @desc  Get all users (admin)
// @route GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all doctors with profiles
// @route GET /api/users/doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate("user", "name email phone avatar")
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create doctor account (admin only)
// @route POST /api/users/doctors
const createDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, consultationFee } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password, role: "doctor", phone });
    const profile = await DoctorProfile.create({
      user: user._id,
      specialization,
      qualification,
      experience,
      consultationFee,
    });

    res.status(201).json({ user: { id: user._id, name, email, role: "doctor" }, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update doctor profile
// @route PUT /api/users/doctors/:id
const updateDoctorProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOneAndUpdate(
      { user: req.params.id },
      req.body,
      { new: true }
    ).populate("user", "name email");

    if (!profile) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update own profile (any role)
// @route PUT /api/users/me
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true }
    ).select("-password -otp -otpExpires");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete user (admin)
// @route DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await DoctorProfile.findOneAndDelete({ user: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, getDoctors, createDoctor, updateDoctorProfile, updateMyProfile, deleteUser };