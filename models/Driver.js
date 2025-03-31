const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverNumber: { type: String, required: true, unique: true },  // Ensure unique driverNumber
  driverAddress: { type: String, required: true },
  driverHospital: { type: String, required: true },
  vehicleType: { type: String, required: true }
});

module.exports = mongoose.model('Driver', driverSchema);
