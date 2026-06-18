const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },       // "500mg"
  frequency: { type: String },    // "twice a day"
  duration: { type: String },     // "7 days"
  instructions: { type: String }, // "take after meals"
});

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicines: [medicineSchema],
    diagnosis: { type: String },
    advice: { type: String },
    followUpDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);