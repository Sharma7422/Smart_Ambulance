const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Registration
exports.registerAdmin = async (req, res) => {
  const { username, password, role } = req.body;

  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) {
    return res.status(400).json({ message: "Username already taken" });
  }

  try {
    const newAdmin = new Admin({ username, password, role: role || "admin" });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login Request Data:", req.body); // Debugging log

  try {
    // Trim username to remove extra spaces
    const trimmedUsername = username.trim();

    // Find admin by username (case-sensitive)
    const admin = await Admin.findOne({ username: trimmedUsername });

    if (!admin) {
      console.log("Admin not found in DB!");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("Admin Found:", admin); // Debugging log

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password Match:", isMatch); // Debugging log

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,  // Ensure you have JWT_SECRET in your .env file
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

// Get Admin Details
exports.getAdminDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin details", error: err });
  }
};
