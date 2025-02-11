const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
  hospitalName: { type: String, required: true },
  ambulanceType: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  pickupCoordinates: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  dropAddress: { type: String, required: true },
  dropCoordinates: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Booking", bookingSchema);
