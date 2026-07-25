const Prescription = require('../models/Prescription')

// Create prescription
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, diagnosis, medicines, notes } = req.body

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: req.user._id,
      diagnosis,
      medicines,
      notes
    })

    await prescription.populate('patient', 'name email')
    await prescription.populate('doctor', 'name specialization')

    res.status(201).json({ success: true, prescription })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get doctor's prescriptions
const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.user._id })
      .populate('patient', 'name email')
      .populate('appointment', 'date timeSlot')
      .sort({ createdAt: -1 })
    res.json({ success: true, prescriptions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get patient's prescriptions
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date timeSlot')
      .sort({ createdAt: -1 })
    res.json({ success: true, prescriptions })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get single prescription
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'date timeSlot type')
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' })
    res.json({ success: true, prescription })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { createPrescription, getDoctorPrescriptions, getPatientPrescriptions, getPrescription }