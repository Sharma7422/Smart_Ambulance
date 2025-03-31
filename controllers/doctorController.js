const Doctor = require("../models/Doctor");

// Register Doctor
exports.registerDoctor = async (req, res) => {
    try {
        console.log("Request Body:", req.body);  // Debugging log
        console.log("Uploaded File:", req.file); // Debugging log

        if (!req.file) {
            return res.status(400).json({ message: "Medical License is required" });
        }

        const { doctorName, doctorEmail, doctorPhone, doctorAddress, specialization, experience, availability, emergencyContact } = req.body;

        const newDoctor = new Doctor({
            doctorName,
            doctorEmail,
            doctorPhone,
            doctorAddress,
            specialization,
            experience,
            availability,
            emergencyContact,
            medicalLicense: req.file.path // Save file path
        });

        await newDoctor.save();
        res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });

    } catch (error) {
        console.error("Error registering doctor:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};