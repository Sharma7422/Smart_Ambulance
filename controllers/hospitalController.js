const Hospital = require("../models/Hospital"); // Ensure correct path

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

        // ✅ Validate required fields
        if (!hospitalName || !hospitalAddress || !hospitalPhone || !hospitalEmail || !numDrivers || !numAmbulances || !numDoctors || !emergencyContact) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check for duplicate email before inserting
        const existingHospital = await Hospital.findOne({ hospitalEmail });
        if (existingHospital) {
            return res.status(400).json({ message: "Hospital with this email already exists!" });
        }

        // ✅ Save hospital details in the database
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

        // ✅ Send JSON success response instead of redirecting
        res.status(201).json({ message: "Hospital registered successfully!" });

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
