const express = require('express')
const router = express.Router()
const User = require('../models/User')
const {protect} = require('../middleware/Auth')

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
router.post('/add-doctor', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Only admin can add doctors' })

    const { name, email, password, specialization } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already in use' })

    const doctor = await User.create({ name, email, password, role: 'doctor', specialization })
    res.status(201).json({ success: true, doctor })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router