const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
    hospitalName: { type: String, required: true },
    ambulanceType: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    dropAddress: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Assigned", "Completed"], default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
