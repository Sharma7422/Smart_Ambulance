const Driver = require("../models/Driver");
const User = require("../models/User");
const Booking = require("../models/Booking");
exports.createBooking = async (req, res) => {
    try {
        const { userId, hospitalName, ambulanceType, pickupAddress, dropAddress } = req.body;

        const newBooking = new Booking({
            userId,
            hospitalName,
            ambulanceType,
            pickupAddress,
            dropAddress,
            status: "Pending" // Default status
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: "Error creating booking", error });
    }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email") // ✅ Populate user details (Only name & email)
            .populate("driverId", "name"); // ✅ Populate driver details

        const drivers = await Driver.find({}, "name"); // Fetch only name field

        res.render("admin/ambulanceRequests", { bookings, drivers });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Error loading ambulance requests page.");
    }
};

// Assign driver to a booking
exports.assignDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverId } = req.body;

        const booking = await Booking.findByIdAndUpdate(id, { driverId, status: "Assigned" }, { new: true });
        if (!booking) return res.status(404).send("Booking not found");

        res.redirect("/admin/ambulance-requests");
    } catch (error) {
        console.error("Error assigning driver:", error);
        res.status(500).send("Error assigning driver");
    }
};

// Update booking status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) return res.status(404).send("Booking not found");

        res.redirect("/admin/ambulance-requests");
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).send("Error updating status");
    }
};

// Delete a booking request
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ message: "Error deleting booking", error });
    }
};
