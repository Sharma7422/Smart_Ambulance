const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// ✅ Debugging: Ensure Controller is Loaded
// console.log("Booking Controller Loaded:", bookingController);

// ✅ Create a new booking
router.post("/bookings", bookingController.createBooking);

// ✅ Get all bookings
router.get("/bookings", bookingController.getAllBookings);

// ✅ Assign a driver
router.put("/bookings/assign/:id", bookingController.assignDriver);

// ✅ Update booking status
router.put("/bookings/status/:id", bookingController.updateStatus);

// ✅ Delete a booking request
router.delete("/bookings/:id", bookingController.deleteBooking);

module.exports = router;
