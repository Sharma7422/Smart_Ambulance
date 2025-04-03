require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const ejsMate = require("ejs-mate");
const multer = require('multer');
const User = require('./models/User'); // Adjust the path based on where your user model is located
const cors = require("cors");
const fs = require("fs");
// const socketIo = require('socket.io');
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
const methodOverride = require('method-override');
const cookieParser = require("cookie-parser");
const { Vonage } = require("@vonage/server-sdk");
// const path = require("path");

// const { twilioPhoneNumber, accountSid, authToken } = require('./config/twilio'); // Twilio credentials

// Route imports
const userRoute = require("./routes/userRoute");
const driverRoute = require("./routes/driverRoute");
const bookingRoutes = require("./routes/bookingRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoutes = require("./routes/doctorRoutes");
const hospitalRoute = require("./routes/hospitalRoute");
const adminDashboard = require("./routes/adminDashboard");

const app = express();

// MongoDB Connection URL
const MONGO_URL = "mongodb://localhost:27017/Smart_Ambulance";

// MongoDB connection setup
mongoose.connect(MONGO_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });



  
  
  

// Middleware Setup
app.use(cors());
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
// app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files
const upload = multer({ dest: 'uploads/' });
 // Multer config for file uploads
// const client = new twilio(accountSid, authToken)

// Set the port (either from the environment or 8080)
const PORT = process.env.PORT || 3456;

// Routes
// app.use("/users", userRoute);  // User related routes
app.use("/api/users", userRoute); // API for bookings
app.use("/api", driverRoute); // Driver related routes
app.use("/api", bookingRoutes);  // Booking related routes
app.use("/admin", adminRoute);  // Admin related routes
app.use("/api/doctors", doctorRoutes); //Doctor related route
app.use("/api", hospitalRoute); //Hospital related route
app.use("/admin", adminDashboard);  //Dashboard related route
// app.use("/api", bookingRoute);



// Home Route (accessible to all)
app.get("/", (req, res) => {
  res.send("Welcome to Smart Ambulance Service");
});


// // Serve the signup page when accessing the /admin/register route
// app.get("/admin/register", (req, res) => {
//   res.render("services/signUp.ejs");  // Render signUp.ejs when visiting /admin/register
// });

// // Render login page
// app.get("/admin/login", (req, res) => {
//   res.render("services/login.ejs");
// });


// Register admin routes
app.use("/admin", adminRoute);

// Index Route (accessible to all users)
app.get("/ambulance", async (req, res) => {
  try {
    res.render("services/index.ejs");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


// Aboutus route
app.get("/aboutUs",(req,res)=>{
  res.render("services/about.ejs");
});


// Services route
app.get("/service",(req,res)=>{
  res.render("services/services.ejs");
});

// Services Types Routes

// Normal Ambulance
app.get("/service_Normal",(req,res)=>{
  res.render("services/Normal_Ambulance.ejs");
});

// Oxygen Ambulance
app.get("/service_Oxygen",(req,res)=>{
  res.render("services/Oxygen_Ambulance.ejs");
});

// ICU Ambulance
app.get("/service_ICU",(req,res)=>{
  res.render("services/ICU_Ambulance.ejs");
});

// DeadBody Ambulance
app.get("/service_DeadBody",(req,res)=>{
  res.render("services/DeadBody_Ambulance.ejs");
});

// ContactUs route
app.get("/contact",(req,res)=>{
  res.render("services/contact.ejs");
});

// Booking Ambulance
app.get("/book-ambulance", (req, res) => res.render("services/Booking_Form.ejs"));


const VONAGE_API_KEY = "82380d1b"; // Replace with your Vonage API Key
  const VONAGE_API_SECRET = "RbUfl5hpeBR3k5Zr"; // Replace with your Vonage API Secret
  const VONAGE_SENDER_ID = "Vonage APIs"; // Sender ID (can be any name)
  
  const vonage = new Vonage({
    apiKey: VONAGE_API_KEY,
    apiSecret: VONAGE_API_SECRET,
  });

// Route to handle ambulance booking form submission
app.post("/book-ambulance", async (req, res) => {
  try {
    const { userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress } = req.body;

    if (!userName || !userPhone || !ambulanceType || !hospitalName || !pickupAddress || !destinationAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({
      userName,
      userPhone,
      ambulanceType,
      hospitalName,
      pickupAddress,
      destinationAddress,
    });

    await newUser.save();

    // ✅ Ensure phone number is in correct format with country code
    const formattedPhone = formatIndianPhoneNumber(userPhone);

    // ✅ SMS Message Format
    const messageBody = `🚑 Ambulance Booked! 🚑\n\nName: ${userName}\nType: ${ambulanceType}\nHospital: ${hospitalName}\nPickup: ${pickupAddress}\nDestination: ${destinationAddress}`;

    // ✅ Send SMS using Vonage
    vonage.sms.send({
      to: formattedPhone,
      from: VONAGE_SENDER_ID,
      text: messageBody,
    })
      .then((resp) => {
        console.log('Message sent successfully');
        console.log(resp);
      })
      .catch((err) => {
        console.log('There was an error sending the messages.');
        console.error(err);
      });


    // ✅ Return JSON response instead of redirecting
    res.json({ success: true, redirectUrl: "/ambulance" });
  } catch (err) {
    console.error("Error booking ambulance:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ Format phone number to include the Indian country code (+91)
function formatIndianPhoneNumber(phone) {
  phone = phone.trim();
  if (!phone.startsWith("91")) {
    phone = "91" + phone; // Ensure country code is added
  }
  return phone;
}

// app.post("/book-ambulance", upload.none(), async (req, res) => {
//   const { userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress } = req.body;

//   try {
//     // Ensure all required fields are provided
//     if (!userName || !userPhone || !ambulanceType || !hospitalName || !pickupAddress || !destinationAddress) {
//       return res.status(400).send("All fields are required.");
//     }

//     // Save the form data in the User collection
//     const newUser = new User({
//       userName,
//       userPhone,
//       ambulanceType,
//       hospitalName,
//       pickupAddress,
//       destinationAddress
//     });

//     await newUser.save();

//     // Send SMS notification using Twilio
//     // const messageBody = `Ambulance booking confirmed! Type: ${ambulanceType}, Hospital: ${hospitalName}, Pickup: ${pickupAddress}, Destination: ${destinationAddress}.`;

//     // console.log("Sending SMS to:", userPhone);

//     // await client.messages.create({
//     //   body: messageBody,
//     //   from: twilioPhoneNumber,  // Your Twilio phone number
//     //   to: userPhone,  // User's phone number
//     // });

//     // Redirect to a success page or response
//     res.redirect("/ambulance"); // Redirect to a success page or send a success response

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// API routes
// app.use('/bookings', bookingRoute);  // Prefix all routes with /bookings

// Start server
// const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Smart Ambulance Services Project 
// Submission Date is :- 3-April-2025