const Appointment = require("../models/Appointment");

// @desc  Book appointment
// @route POST /api/appointments
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms, type } = req.body;

    // Conflict detection — same doctor, date, timeslot
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $nin: ["cancelled"] },
    });
    if (conflict) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      symptoms,
      type: type || "in-person",
    });

    await appointment.populate("doctor", "name email");
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get my appointments (patient or doctor)
// @route GET /api/appointments
const getMyAppointments = async (req, res) => {
  try {
    const filter =
      req.user.role === "patient"
        ? { patient: req.user._id }
        : { doctor: req.user._id };

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("doctor", "name email")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single appointment
// @route GET /api/appointments/:id
const getAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email");

    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update appointment status
// @route PATCH /api/appointments/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Cancel appointment
// @route DELETE /api/appointments/:id
const cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment cancelled", appt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all appointments (admin)
// @route GET /api/appointments/all
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointment,
  updateStatus,
  cancelAppointment,
  getAllAppointments,
};