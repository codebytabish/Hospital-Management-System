const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["in-person", "telemedicine", "online"],
      default: "in-person",
    },
    symptoms: { type: String },
    notes: { type: String },
    aiUrgency: {
      type: String,
      enum: ["low", "moderate", "high", "emergency"],
    },
    meetingUrl: { type: String }, // ← Jitsi video call URL for online appointments
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);