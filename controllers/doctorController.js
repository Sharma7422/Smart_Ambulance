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

        // ✅ Redirect to the list of doctors after registration
        res.redirect("/admin/doctors");

    } catch (error) {
        console.error("Error registering doctor:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// ✅ Get all doctors
// exports.getAllDoctors = async (req, res) => {
//     try {
//         const doctors = await Doctor.find();
//         res.status(200).json({ success: true, doctors });
//     } catch (error) {
//         console.error("Error fetching doctors:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
// };

// ✅ Get doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        res.json(doctor);
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// ✅ Delete a doctor by ID
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }
        res.status(200).json({ success: true, message: "Doctor deleted successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};