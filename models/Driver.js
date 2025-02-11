const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[0-9]{10}$/ // Example for 10-digit phone numbers
  },
  vehicleNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /^[A-Z0-9]+$/ // Example for alphanumeric vehicle number
  },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
}, { timestamps: true });

DriverSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model("Driver", DriverSchema);
