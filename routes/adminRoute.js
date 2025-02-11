const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminDetails } = require('../controllers/adminController');
// // Admin Registration Route
// router.post("/register", adminController.registerAdmin);

// // Admin Login Route
// router.post("/login", adminController.loginAdmin);

// Admin Registration Route
router.get("/register", (req, res) => {
    res.render("services/signUp.ejs"); // Make sure the file is named 'signUp.ejs'
  });
  
  // Admin Login Route
  router.get("/login", (req, res) => {
    res.render("services/login.ejs"); // Make sure the file is named 'login.ejs'
  });

  // Admin Registration Form Submission Route
router.post("/register", registerAdmin);

// Admin Login Form Submission Route
router.post("/login", loginAdmin);

// Get Admin Details by ID
// router.get("/:id", adminController.getAdminDetails);

module.exports = router;
