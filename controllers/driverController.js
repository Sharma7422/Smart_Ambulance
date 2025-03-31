const Driver = require("../models/Driver");

// Register a new driver
exports.registerDriver = async (req, res) => {
  try {
      console.log("Received Data:", req.body);  // ✅ Debugging

      const { driverName, vehicleNumber, driverNumber, driverAddress, driverHospital, vehicleType } = req.body;
      
      if (!driverName || !vehicleNumber || !driverNumber || !driverAddress || !driverHospital || !vehicleType) {
          return res.status(400).json({ error: "All fields are required" });
      }

      const newDriver = new Driver({
          driverName,
          vehicleNumber,
          driverNumber,
          driverAddress,
          driverHospital,
          vehicleType
      });

      await newDriver.save();
      res.redirect("/drivers");
  } catch (error) {
      console.error("Error registering driver:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all drivers
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.status(200).json(driver);
    } catch (error) {
        console.error("Error fetching driver:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Delete driver by ID
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
        console.error("Error deleting driver:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
