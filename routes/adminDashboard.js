const express = require("express");
const router = express.Router();
// const { requireAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Hospital = require("../models/Hospital");
const Booking = require("../models/Booking");
const Doctor = require("../models/Doctor");

// Import hospital controller functions
const { registerHospital, getHospitals, getHospitalById } = require("../controllers/hospitalController");
const userController = require("../controllers/userController");

const bookingController = require("../controllers/bookingController");
const { requireAuth } = require("../middlewares/authMiddleware");



const adminController = require("../controllers/adminDashboard");


// const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

// ------------------------ ADMIN DASHBOARD ROUTES ------------------------ //

// ✅ Admin Dashboard - Overview Statistics
router.get("/dashboard", requireAuth,async (req, res) => {
    try {
        const totalAmbulances = await Driver.countDocuments();
        const totalRequests = await Booking.countDocuments();
        const assignedRequests = await Booking.countDocuments({ status: "Assigned" });
        const onTheWayAmbulances = await Booking.countDocuments({ status: "On The Way" });
        const patientPicked = await Booking.countDocuments({ status: "Picked" });
        const patientReached = await Booking.countDocuments({ status: "Reached" });
        const rejectedRequests = await Booking.countDocuments({ status: "Rejected" });
        const newRequests = await Booking.countDocuments({ status: "New" });
        const totalDoctor = await Doctor.countDocuments();
        const totalUser = await User.countDocuments();
        const totalHospital = await Hospital.countDocuments();
        const totalDriver =  await Driver.countDocuments();

        res.render("admin/dashboard", {
            totalAmbulances,
            totalRequests,
            assignedRequests,
            onTheWayAmbulances,
            patientPicked,
            patientReached,
            rejectedRequests,
            newRequests,
            totalDoctor,
            totalUser,
            totalHospital,
            totalDriver
        });
    } catch (error) {
        res.status(500).send("Error loading dashboard");
    }
});

// ✅ List of Users (View Users)
router.get("/users", userController.getAllUsers);

// Show All Ambulances (Ambulance Details)
router.get("/ambulances", async (req, res) => {
    try {
        const { hospital, type } = req.query;
        let query = {};

        if (hospital) query.driverHospital = { $regex: hospital, $options: "i" };
        if (type) query.vehicleType = { $regex: type, $options: "i" };

        const ambulances = await Driver.find(query);
        res.render("admin/ambulanceList", { ambulances, hospital, type });  
    } catch (error) {
        console.error("Error fetching ambulances:", error);
        res.status(500).send("Error loading ambulances");
    }
});

// ✅ Fetch all ambulance requests (Admin Panel)
// router.get("/ambulance-requests", async (req, res) => {
//     try {
//         const requests = await Booking.find()
//             .populate("userId", "userName userPhone")
//             .populate("driverId", "driverName vehicleNumber")
//             .exec();

//         res.render("admin/ambulanceRequests", { requests });
//     } catch (error) {
//         console.error("Error fetching ambulance requests:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });


// ✅ Admin Panel - Show All Drivers
router.get("/drivers", async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.render("admin/drivers", { drivers });  // Renders 'views/admin/drivers.ejs'
    } catch (error) {
        console.error("Error fetching drivers:", error);
        res.status(500).send("Error loading drivers");
    }
});

// ✅ List of Hospitals (Admin View)
router.get("/hospitals", async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.render("admin/hospitals", { hospitals });
    } catch (error) {
        res.status(500).send("Error fetching hospitals");
    }
});


router.get("/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find();
        
        // ✅ Render the list of doctors, not the registration form
        res.render("admin/doctor", { doctors }); 
    } catch (error) {
        res.status(500).send("Error fetching doctors");
    }
});




// ------------------------ HOSPITAL MANAGEMENT ------------------------ //

// ✅ Serve the Hospital Registration Form (Admin Panel)
router.get("/register-hospital", (req, res) => {
    res.render("admin/hospital_form");  // Ensure this file exists inside views/admin/
});

// ✅ Register a New Hospital (POST Request)
router.post("/register-hospital", async (req, res) => {
    try {
        await registerHospital(req, res); // ✅ Don't call `res.redirect()` again here!
    } catch (error) {
        console.error("Hospital registration error:", error);
        res.status(500).send("Error registering hospital");
    }
});

// ✅ View Hospital Details (Admin)
router.get("/hospitals/:id", async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).send("Hospital not found");
        }
        res.render("admin/hospital_details", { hospital });
    } catch (error) {
        console.error("Error fetching hospital details:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Delete Hospital
router.post("/delete-hospital/:id", async (req, res) => {
    try {
        const hospitalId = req.params.id;
        await Hospital.findByIdAndDelete(hospitalId);
        res.redirect("/admin/hospitals"); // Redirect back to hospital list
    } catch (error) {
        res.status(500).send("Error deleting hospital");
    }
});


// ------------------------ ASSIGN DRIVER TO USER ------------------------ //


// ✅ Route to render the Driver Registration Form
router.get("/register-driver", (req, res) => {
    res.render("admin/Driver_Reg_Form"); // This will render 'views/Driver_Reg_Form.ejs'
});

// ✅ Admin Panel - Handle Driver Registration
router.post("/register-driver", async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        const { driverName, vehicleNumber, driverNumber, driverAddress, driverHospital, vehicleType } = req.body;

        if (!driverName || !vehicleNumber || !driverNumber || !driverAddress || !driverHospital || !vehicleType) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newDriver = new Driver({ driverName, vehicleNumber, driverNumber, driverAddress, driverHospital, vehicleType });
        await newDriver.save();

        res.redirect("/admin/drivers"); // Redirect to drivers list after adding
    } catch (error) {
        console.error("Error registering driver:", error);
        res.status(500).send("Error registering driver");
    }
});

// ✅ Admin Panel - Delete Driver
router.get("/delete-driver/:id", async (req, res) => {
    try {
        await Driver.findByIdAndDelete(req.params.id);
        res.redirect("/admin/drivers"); // Refresh driver list
    } catch (error) {
        console.error("Error deleting driver:", error);
        res.status(500).send("Error deleting driver");
    }
});

// ✅ Assign Driver to a User (Ambulance Request)
// router.post("/assign-driver", async (req, res) => {
//     const { userId, driverId } = req.body;
//     try {
//         const user = await User.findById(userId);
//         const driver = await Driver.findById(driverId);

//         if (!user || !driver) {
//             return res.status(404).send("User or Driver not found");
//         }

//         user.assignedDriver = driverId;
//         driver.assignedUser = userId;

//         await user.save();
//         await driver.save();

//         res.redirect("/admin/dashboard");
//     } catch (error) {
//         res.status(500).send("Error assigning driver");
//     }
// });


// ------------------------ User Deatils ------------------------ //
router.delete("/users/:id", userController.deleteUser);



// ------------------------ Ambulance Deatils ------------------------ //



// ✅ Edit Ambulance - Render Form
router.get("/edit-ambulance/:id", async (req, res) => {
    try {
        const ambulance = await Driver.findById(req.params.id);
        if (!ambulance) return res.status(404).send("Ambulance not found");
        res.render("admin/editAmbulance", { ambulance });
    } catch (error) {
        res.status(500).send("Error loading ambulance details");
    }
});

// ✅ Update Ambulance
router.post("/edit-ambulance/:id", async (req, res) => {
    try {
        const { driverName, vehicleNumber, driverNumber, driverHospital, vehicleType } = req.body;
        await Driver.findByIdAndUpdate(req.params.id, { driverName, vehicleNumber, driverNumber, driverHospital, vehicleType });
        res.redirect("/admin/ambulances");
    } catch (error) {
        res.status(500).send("Error updating ambulance details");
    }
});

// ✅ Delete Ambulance
router.get("/delete-ambulance/:id", async (req, res) => {
    try {
        await Driver.findByIdAndDelete(req.params.id);
        res.redirect("/admin/ambulances");
    } catch (error) {
        res.status(500).send("Error deleting ambulance");
    }
});


// ------------------------ Ambulance Requests ------------------------ //


// Admin Panel: View all ambulance booking requests
router.get("/ambulance-requests", bookingController.getAllBookings);

// Assign a driver to a request
router.put("/ambulance-requests/assign/:id", bookingController.assignDriver);

// Update booking status
router.put("/ambulance-requests/status/:id", bookingController.updateStatus);

// Delete a request
router.delete("/ambulance-requests/:id", bookingController.deleteBooking);



module.exports = router;
