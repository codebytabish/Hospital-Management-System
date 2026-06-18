const Prescription = require("../models/Prescription");

// @desc  Create prescription (doctor only)
// @route POST /api/prescriptions
const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, diagnosis, advice, followUpDate } =
      req.body;

    const prescription = await Prescription.create({
      doctor: req.user._id,
      patient: patientId,
      appointment: appointmentId,
      medicines,
      diagnosis,
      advice,
      followUpDate,
    });

    await prescription.populate("patient", "name email");
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get prescriptions for logged-in user
// @route GET /api/prescriptions
const getMyPrescriptions = async (req, res) => {
  try {
    const filter =
      req.user.role === "patient"
        ? { patient: req.user._id }
        : { doctor: req.user._id };

    const prescriptions = await Prescription.find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single prescription
// @route GET /api/prescriptions/:id
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name email");

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPrescription, getMyPrescriptions, getPrescription };