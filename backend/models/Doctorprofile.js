const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  startTime: String, // "09:00"
  endTime: String,   // "17:00"
  isAvailable: { type: Boolean, default: true },
});

const doctorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, required: true },
    qualification: { type: String },
    experience: { type: Number, default: 0 }, // years
    bio: { type: String },
    consultationFee: { type: Number, default: 0 },
    availableSlots: [slotSchema],
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isAcceptingPatients: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DoctorProfile", doctorProfileSchema);