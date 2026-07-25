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

// Get all patients — admin only
router.get('/patients', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('name email phone createdAt')
    res.json({ success: true, patients })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete user — admin only
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' })
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, specialization  } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, specialization },
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