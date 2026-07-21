const Appointment = require('../models/Appointment')
const User = require('../models/User')
const notifyPatient = require('../utils/notifyPatient')

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms, type } = req.body

    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] }
    })
    if (conflict)
      return res.status(409).json({ message: 'This time slot is already booked' })

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      symptoms,
      type: type || 'in-person'
    })

    await appointment.populate('doctor', 'name email specialization')
    res.status(201).json(appointment)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMyAppointments = async (req, res) => {
  try {
    const filter = req.user.role === 'patient'
      ? { patient: req.user._id }
      : { doctor: req.user._id }

    const appointments = await Appointment.find(filter)
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email phone')
      .sort({ date: 1 })

    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email phone')

    if (!appt) return res.status(404).json({ message: 'Appointment not found' })
    res.json(appt)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body

    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email')

    if (!appt) return res.status(404).json({ message: 'Appointment not found' })

    // Notify patient on confirm or cancel
    if (status === 'confirmed' || status === 'cancelled') {
      await notifyPatient({
        patient: appt.patient,
        doctor: appt.doctor,
        appointment: appt,
        status
      })
    }

    res.json(appt)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email')

    if (!appt) return res.status(404).json({ message: 'Appointment not found' })

    await notifyPatient({
      patient: appt.patient,
      doctor: appt.doctor,
      appointment: appt,
      status: 'cancelled'
    })

    res.json({ message: 'Appointment cancelled', appt })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name email specialization')
      .populate('patient', 'name email phone')
      .sort({ date: -1 })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointment,
  updateStatus,
  cancelAppointment,
  getAllAppointments
}