const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  doctorEmail: { type: String, required: true, unique: true },
  doctorPhone: { type: String, required: true },
  doctorAddress: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  availability: { type: String, required: true },
  medicalLicense: { type: String, required: true }, // File path
  emergencyContact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
