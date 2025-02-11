const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const NodeGeocoder = require("node-geocoder");

// Configure the geocoder
const geocoder = NodeGeocoder({
  provider: "openstreetmap", // Options: 'google', 'mapbox', etc.
});

/**
 * Create a new booking
 * Handles geocoding for pickup and drop addresses and stores the information in the database
 */
exports.createBooking = async (req, res) => {
  const { userId, driverId, hospitalName, ambulanceType, pickupAddress, dropAddress } = req.body;

  if (!userId || !driverId || !hospitalName || !ambulanceType || !pickupAddress || !dropAddress) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Debugging: Log the userId and driverId to verify
    console.log("Received userId:", userId);
    console.log("Received driverId:", driverId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid userId or driverId format" });
    }

    // Convert to ObjectId
    const userObjectId = mongoose.Types.ObjectId(userId);
    const driverObjectId = mongoose.Types.ObjectId(driverId);

    // Geocode pickup and drop addresses
    const pickupLocation = await geocoder.geocode(pickupAddress);
    const dropLocation = await geocoder.geocode(dropAddress);

    if (!pickupLocation.length || !dropLocation.length) {
      return res.status(400).json({ message: "Invalid pickup or drop address" });
    }

    // Create a new booking document
    const newBooking = new Booking({
      userId: userObjectId,
      driverId: driverObjectId,
      hospitalName,
      ambulanceType,
      pickupAddress,
      pickupCoordinates: {
        type: "Point",
        coordinates: [pickupLocation[0].longitude, pickupLocation[0].latitude], // [longitude, latitude]
      },
      dropAddress,
      dropCoordinates: {
        type: "Point",
        coordinates: [dropLocation[0].longitude, dropLocation[0].latitude], // [longitude, latitude]
      },
      status: "pending",
    });

    // Save booking to the database
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Error creating booking", error: err.message || err });
  }
};




/**
 * Get booking by ID
 */
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error fetching booking", error: err });
  }
};

/**
 * Update booking status
 */
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true } // Return the updated document
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (err) {
    res.status(500).json({ message: "Error updating booking status", error: err });
  }
};
