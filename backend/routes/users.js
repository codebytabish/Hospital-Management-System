const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect, authorizeRoles } = require('../middleware/auth')

// Get all doctors
router.get('/doctors', protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email specialization')
    res.json({ success: true, doctors })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add doctor — admin only
router.post('/add-doctor', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already in use' })

    const doctor = await User.create({ name, email, password, role: 'doctor', specialization })
    res.status(201).json({ success: true, doctor })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    ).select('-password')

    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch)
      return res.status(400).json({ message: 'Current password is incorrect' })

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router