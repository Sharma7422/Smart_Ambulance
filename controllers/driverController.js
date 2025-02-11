const Driver = require("../models/Driver");

// Create a new driver
exports.createDriver = async (req, res) => {
  const { name, phone, vehicleNumber, longitude, latitude } = req.body;

  if (!name || !phone || !vehicleNumber || longitude === undefined || latitude === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newDriver = new Driver({
      name,
      phone,
      vehicleNumber,
      currentLocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    await newDriver.save();
    res.status(201).json({ message: "Driver created successfully", driver: newDriver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating driver", error: err });
  }
};

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching drivers", error: err });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (err) {
    res.status(500).json({ message: "Error fetching driver", error: err });
  }
};

// Update driver's location
exports.updateDriverLocation = async (req, res) => {
  const { id } = req.params;
  const { longitude, latitude } = req.body;

  if (longitude === undefined || latitude === undefined) {
    return res.status(400).json({ message: "Missing location coordinates" });
  }

  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      {
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );
    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver location updated", driver: updatedDriver });
  } catch (err) {
    res.status(500).json({ message: "Error updating driver's location", error: err });
  }
};
