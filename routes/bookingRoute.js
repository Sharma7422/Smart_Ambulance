const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Define the route for creating a booking
router.post('/bookings', bookingController.createBooking);

// Optionally, if you have a GET route:
router.get('/bookings', (req, res) => {
    res.send('This is the bookings endpoint');
});

module.exports = router;
