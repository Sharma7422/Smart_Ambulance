const User = require("../models/User");
// const twilio = require('twilio');
// const { twilioPhoneNumber, accountSid, authToken } = require('../config/twilio'); // Import your Twilio credentials

// const client = new twilio(accountSid, authToken);

// Create a new user and send an SMS notification
exports.createUser = async (req, res) => {
  const { name, email, phone, longitude, latitude, ambulanceType, hospitalName, pickupAddress, destinationAddress } = req.body;

  // Validation for required fields
  if (!name || !email || !phone || longitude === undefined || latitude === undefined || !ambulanceType || !hospitalName || !pickupAddress || !destinationAddress) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      ambulanceDetails: {
        ambulanceType,
        hospitalName,
        pickupAddress,
        destinationAddress,
      },
      currentLocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    await newUser.save();

    // Send SMS notification via Twilio
    // const messageBody = `Ambulance booked successfully! Type: ${ambulanceType}, Hospital: ${hospitalName}, Pickup: ${pickupAddress}, Destination: ${destinationAddress}.`;

    // console.log("Sending SMS to:", phone);

    // await client.messages.create({
    //   body: messageBody,
    //   from: twilioPhoneNumber,  // Your Twilio phone number
    //   to: phone,  // User's phone number
    // });

    // res.status(201).json({ message: "User created and ambulance booked successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};
