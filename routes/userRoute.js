const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, getUserById } = require("../controllers/userController");

// Create User (ambulance booking with SMS notification)
router.post("/", createUser);

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id", getUserById);

module.exports = router;
