const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    userPhone: { type: String, required: true },
    ambulanceType: { type: String, required: true },
    hospitalName: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    destinationAddress: { type: String, required: true },  // New field
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
