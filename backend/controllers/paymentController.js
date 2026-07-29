const Payment = require('../models/Payment')
const Appointment = require('../models/Appointment')

// Create payment
const createPayment = async (req, res) => {
  try {
    const { appointmentId, amount, method, transactionId } = req.body

    const payment = await Payment.create({
      appointment: appointmentId,
      patient: req.user._id,
      amount,
      method,
      status: 'completed',
      transactionId: transactionId || `TXN-${Date.now()}`
    })

    res.status(201).json({ success: true, payment })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get my payments
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user._id })
      .populate('appointment', 'date timeSlot type')
      .sort({ createdAt: -1 })
    res.json({ success: true, payments })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createPayment, getMyPayments }