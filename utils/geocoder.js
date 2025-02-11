const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your Google Maps API Key
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
