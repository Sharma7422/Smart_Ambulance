const User = require("../models/User");
const axios = require("axios");

// Fast2SMS API Configuration
const FAST2SMS_API_KEY = "YJDBzmhAXt923QI0FHqP5ycSjrOiUna18ZW76MNRlwbeoGEpfve3h2GwdFm6OtDnu9BC5WJNPogLiXpA"; // Replace with your actual API key

// Create a new user and send an SMS notification
exports.createUser = async (req, res) => {
  const { userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress } = req.body;

  if (!userName || !userPhone || !ambulanceType || !hospitalName || !pickupAddress || !destinationAddress) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newUser = new User({ userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress });
    await newUser.save();

    // Send SMS notification using Fast2SMS
    const messageBody = `Ambulance booked!\nName: ${userName}\nType: ${ambulanceType}\nHospital: ${hospitalName}\nPickup: ${pickupAddress}\nDestination: ${destinationAddress}`;
    await sendSMS(userPhone, messageBody);

    // ✅ Return JSON response with redirect URL
    res.json({ redirectUrl: "/ambulance" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// SMS sending function
async function sendSMS(phone, message) {
  try {
    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", {
      route: "v3",
      sender_id: "TXTIND",
      message: message,
      language: "english",
      numbers: phone,
    }, {
      headers: {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/json"
      }
    });

    console.log("Fast2SMS Response:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.response ? error.response.data : error.message);
  }
}


// Get all users (View Users)
exports.getAllUsers = async (req, res) => {
  try {
      const users = await User.find();
      res.render("admin/userList", { users });  // Render user list in admin panel
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal Server Error" });
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
