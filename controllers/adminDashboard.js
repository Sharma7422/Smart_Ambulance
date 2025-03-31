const Booking = require("../models/Booking");
const Driver = require("../models/Driver");

// Get all bookings (No authentication required)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("userId").populate("driverId");
        res.render("admin/ambulanceRequests", { bookings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error });
    }
};

// Filter bookings by status
exports.filterBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const bookings = await Booking.find({ status }).populate("userId").populate("driverId");
        res.render("admin/ambulanceRequests", { bookings });
    } catch (error) {
        res.status(500).json({ message: "Error filtering bookings", error });
    }
};

// Assign driver to a booking
exports.assignDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverId } = req.body;

        const booking = await Booking.findByIdAndUpdate(id, { driverId, status: "Assigned" }, { new: true });
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.redirect("/admin/ambulance-requests"); // Redirect to refresh the page
    } catch (error) {
        res.status(500).json({ message: "Error assigning driver", error });
    }
};

// Update booking status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        res.redirect("/admin/ambulance-requests");
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error });
    }
};

// Delete a booking request
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.redirect("/admin/ambulance-requests");
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error });
    }
};
