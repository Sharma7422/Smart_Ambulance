const express = require("express");
const router = express.Router();
const { createDriver, getAllDrivers, getDriverById, updateDriverLocation } = require("../controllers/driverController");

// Create Driver
router.post("/", createDriver);

// Get all drivers
router.get("/", getAllDrivers);

// Get driver by ID
router.get("/:id", getDriverById);

// Update driver's location
router.put("/:id/location", updateDriverLocation);

module.exports = router;
