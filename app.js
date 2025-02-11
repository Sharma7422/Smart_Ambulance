require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const ejsMate = require("ejs-mate");
const multer = require('multer');
const User = require('./models/User'); // Adjust the path based on where your user model is located

// const { twilioPhoneNumber, accountSid, authToken } = require('./config/twilio'); // Twilio credentials

// Route imports
const userRoute = require("./routes/userRoute");
const driverRoute = require("./routes/driverRoute");
const bookingRoute = require("./routes/bookingRoute");
const adminRoute = require("./routes/adminRoute");

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
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
const upload = multer({ dest: 'uploads/' }); // Multer config for file uploads
// const client = new twilio(accountSid, authToken)

// Set the port (either from the environment or 8080)
const PORT = process.env.PORT || 8080;

// Routes
app.use("/users", userRoute);  // User related routes
app.use("/drivers", driverRoute);  // Driver related routes
app.use("/bookings", bookingRoute);  // Booking related routes
app.use("/admin", adminRoute);  // Admin related routes

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

// ContactUs route
app.get("/contact",(req,res)=>{
  res.render("services/contact.ejs");
});


app.get("/ambulance/book", async (req, res) => {
  try {
    res.render("services/Booking_Form.ejs");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});


// Route to handle ambulance booking form submission
app.post('/book-ambulance', async (req, res) => {
  try {
    // Extract the data from the request body
    const { userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress } = req.body;

    // Validate the data
    if (!userName || !userPhone || !ambulanceType || !hospitalName || !pickupAddress || !destinationAddress) {
      return res.status(400).send("All fields are required.");
    }

    // Create a new user
    const newUser = new User({
      userName,
      userPhone,
      ambulanceType,
      hospitalName,
      pickupAddress,
      destinationAddress,
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    // res.status(201).json({ message: "Ambulance booking confirmed!", user: newUser });
    res.redirect("/ambulance"); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

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
app.use('/bookings', bookingRoute);  // Prefix all routes with /bookings

// Start server
// const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
