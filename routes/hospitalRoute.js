const express = require("express");
const router = express.Router();
const { registerHospital, getHospitals, getHospitalById } = require("../controllers/hospitalController");

// ✅ Serve the hospital registration form
router.get("/register-hospital", (req, res) => {
    res.render("admin/hospital_form.ejs"); // Ensure hospital_form.ejs exists in the views folder
});

// ✅ API to register a hospital
router.post("/register-hospital", registerHospital);

// ✅ API to get all hospitals
router.get("/hospitals", getHospitals);

// ✅ API to get a hospital by ID
router.get("/hospitals/:id", getHospitalById);

module.exports = router;
