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
    res.redirect("/admin/login");
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login Request Data:", req.body);

  try {
    const trimmedUsername = username.trim();
    const admin = await Admin.findOne({ username: trimmedUsername });

    if (!admin) {
      console.log("❌ Admin not found!");
      return res.render("services/login", { errorMessage: "Invalid username or password" });
    }

    console.log("✅ Admin Found:", admin);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("🔑 Password Match:", isMatch);

    if (!isMatch) {
      return res.render("services/login", { errorMessage: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store token in a cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // Redirect to the admin dashboard
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).render("services/login", { errorMessage: "Error logging in. Please try again." });
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
