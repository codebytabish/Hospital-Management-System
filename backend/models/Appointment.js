const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // "10:00 - 10:30"
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["in-person", "telemedicine"],
      default: "in-person",
    },
    symptoms: { type: String }, // patient's described symptoms
    notes: { type: String },    // doctor's notes post-appointment
    aiUrgency: {
      type: String,
      enum: ["low", "moderate", "high", "emergency"],
    },
  },
  { timestamps: true }
);

// Index for conflict detection queries
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);