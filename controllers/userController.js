// const User = require("../models/User");
const axios = require("axios");
const User = require("../models/User");
const { Vonage } = require("@vonage/server-sdk");

const VONAGE_API_KEY = "82380d1b"; // Replace with your Vonage API Key
const VONAGE_API_SECRET = "RbUfl5hpeBR3k5Zr"; // Replace with your Vonage API Secret
const VONAGE_SENDER_ID = "Vonage APIs"; // Sender ID (can be any name)

const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET,
});

exports.createUser = async (req, res) => {
  const { userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress } = req.body;

  if (!userName || !userPhone || !ambulanceType || !hospitalName || !pickupAddress || !destinationAddress) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newUser = new User({ userName, userPhone, ambulanceType, hospitalName, pickupAddress, destinationAddress });
    await newUser.save();

    // ✅ Ensure phone number is in correct format with country code
    const formattedPhone = formatIndianPhoneNumber(userPhone);

    // ✅ SMS Message Format
    const messageBody = `🚑 Ambulance Booked! 🚑\n\nName: ${userName}\nType: ${ambulanceType}\nHospital: ${hospitalName}\nPickup: ${pickupAddress}\nDestination: ${destinationAddress}`;

    // ✅ Send SMS using Vonage
    vonage.sms.send({
      to: formattedPhone,
      from: VONAGE_SENDER_ID,
      text: 'A text message sent using the Vonage SMS API',
    })
      .then((resp) => {
        console.log('Message sent successfully');
        console.log(resp);
      })
      .catch((err) => {
        console.log('There was an error sending the messages.');
        console.error(err);
      });

    res.json({ success: true, redirectUrl: "/ambulance" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Format phone number to include the Indian country code (+91)
function formatIndianPhoneNumber(phone) {
  phone = phone.trim();
  if (!phone.startsWith("91")) {
    phone = "91" + phone; // Ensure country code is added
  }
  return phone;
}

// ✅ SMS Sending Function using Vonage
// async function sendSMS(to, text) {
//   try {
//     const response = await vonage.sms.send({
//       to: to,
//       from: VONAGE_SENDER_ID,
//       text: text,
//     });

//     console.log("SMS Sent Successfully:", response);
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//   }
// }

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
