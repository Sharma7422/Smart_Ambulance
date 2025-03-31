const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // Ensure correct path
const Doctor = require("../models/Doctor"); // ✅ Import the Doctor model
const { registerDoctor } = require("../controllers/doctorController");

// Serve doctor registration form
router.get("/register", (req, res) => {
    res.render("services/doctor_form.ejs"); // Ensure this file exists
});

// Fetch all registered doctors
router.get("/", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        console.log("Doctors Found:", doctors); // ✅ Log data in the terminal
        res.json(doctors);
    } catch (error) {
        console.error("Database Fetch Error:", error);
        res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
});

// Handle doctor registration
router.post("/register", upload.single("medicalLicense"), registerDoctor);

module.exports = router;
