const Hospital = require("../models/Hospital");

// Register a new hospital
exports.registerHospital = async (req, res) => {
    try {
        const {
            hospitalName,
            hospitalAddress,
            hospitalPhone,
            hospitalEmail,
            ambulanceTypes,
            numDrivers,
            numAmbulances,
            numDoctors,
            emergencyContact
        } = req.body;

        // Validate required fields
        if (!hospitalName || !hospitalAddress || !hospitalPhone || !hospitalEmail || !numDrivers || !numAmbulances || !numDoctors || !emergencyContact) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new hospital entry
        const newHospital = new Hospital({
            hospitalName,
            hospitalAddress,
            hospitalPhone,
            hospitalEmail,
            ambulanceTypes,
            numDrivers,
            numAmbulances,
            numDoctors,
            emergencyContact
        });

        await newHospital.save();
        res.redirect("/admin/hospitals");  // ✅ Ensure this is the correct redirect path
    } catch (error) {
        console.error("Error registering hospital:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Fetch all registered hospitals
exports.getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.json(hospitals);
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        res.status(500).json({ message: "Error fetching hospitals", error: error.message });
    }
};

// Fetch a single hospital by ID
exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        res.json(hospital);
    } catch (error) {
        console.error("Error fetching hospital:", error);
        res.status(500).json({ message: "Error fetching hospital", error: error.message });
    }
};
