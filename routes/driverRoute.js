const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

// ✅ Route to render the Driver Registration Form
router.get("/register-driver", (req, res) => {
    res.render("services/Driver_Reg_Form"); // This will render 'views/Driver_Reg_Form.ejs'
});

// ✅ Driver API Routes
router.post('/register-driver', driverController.registerDriver);
router.get("/drivers", driverController.getAllDrivers);
router.get("/drivers/:id", driverController.getDriverById);
router.delete("/drivers/:id", driverController.deleteDriver);

module.exports = router;
