// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const User = require('./models/User');
// const bodyParser = require('body-parser');
// const path = require("path");
// const ejsMate = require("ejs-mate");
// const MONGO_URL = 'mongodb://localhost:27017/Smart_Ambulance';

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//   async function main() {
//   await mongoose.connect(MONGO_URL);
// }
// // Middleware to parse JSON request bodies
// app.use(bodyParser.json());
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.urlencoded({ extended: true }));
// // User route
// app.post("/users", async (req, res) => {
//   const { name, email, phone, longitude, latitude } = req.body;

//   // Validation for required fields
//   if (!name || !email || !phone || longitude === undefined || latitude === undefined) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   // Create a new user instance
//   const newUser = new User({
//     name,
//     email,
//     phone,
//     currentLocation: {
//       type: "Point",
//       coordinates: [longitude, latitude],
//     },
//   });

//   try {
//     // Save user to MongoDB
//     await newUser.save();
//     console.log("User created successfully");
//     res.status(201).json({ message: "User created successfully", user: newUser });
//   } catch (err) {
//     console.error("Error creating user:", err);
//     res.status(500).json({ message: "Error creating user", error: err });
//   }
// });

// // // Route to get all users
// // app.get('/ambulance', async (req, res) => {
// //     try {
// //         const users = await User.find();
// //         res.status(200).json(users);
// //     } catch (err) {
// //         res.status(500).json({ message: 'Error fetching users', error: err });
// //     }
// // });


// // Index Route (accessible to all users)
// app.get("/ambulance", async (req, res) => {
//   try {
//     res.render("services/index.ejs");
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// });


// app.get("/", (req,res)=>{
//     res.send("Hi, I am Root");
// })


// app.listen("8080", () => {
//     console.log("server is listening to port 8080");
//   })