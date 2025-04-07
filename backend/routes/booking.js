const express = require('express');
const router = express.Router();
const Booking = require('../models/booking'); // Ensure this path is correct

// Get booking history without authentication
router.get('/booking-history', async (req, res) => {
    try {
        // Removed authentication: Fetch all bookings
        const bookings = await Booking.find({});
        res.json({
            success: true,
            bookings: bookings
        });
    } catch (error) {
        console.error('Error fetching booking history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking history',
            error: error.message
        });
    }
});

module.exports = router;