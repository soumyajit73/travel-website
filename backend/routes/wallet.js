const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Wallet = require("../models/wallet"); // Make sure path is correct
const User = require("../models/user");
const Booking = require("../models/booking"); // Import the Booking model

// Get wallet route
router.get("/wallet", async (req, res) => {
    try {
        const user = await User.findOne({});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            });
        }

        let wallet = await Wallet.findOne({ userId: user._id });

        if (!wallet) {
            wallet = new Wallet({
                userId: user._id,
                balance: 0,
                transactions: [],
            });
            await wallet.save();
        }

        res.json({
            success: true,
            wallet: wallet,
        });
    } catch (error) {
        console.error("Error fetching wallet:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching wallet",
            error: error.message,
        });
    }
});

// Add funds route
router.post("/wallet/add-funds", async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findOne({});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user found",
            });
        }

        let wallet = await Wallet.findOne({ userId: user._id });

        if (!wallet) {
            wallet = new Wallet({
                userId: user._id,
                balance: 0,
                transactions: [],
            });
        }

        wallet.balance += parseFloat(amount);
        wallet.transactions.push({
            description: "Wallet Top-up",
            amount: parseFloat(amount),
            date: new Date(),
        });

        await wallet.save();

        res.json({
            success: true,
            message: "Funds added successfully",
            wallet: wallet,
        });
    } catch (error) {
        console.error("Error adding funds:", error);
        res.status(500).json({
            success: false,
            message: "Error adding funds",
            error: error.message,
        });
    }
});

// Withdraw funds route
router.post('/wallet/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid amount'
            });
        }

        const user = await User.findOne({});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found'
            });
        }

        let wallet = await Wallet.findOne({ userId: user._id });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Check for sufficient funds
        if (wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds'
            });
        }

        // Process withdrawal
        wallet.balance -= parseFloat(amount);
        wallet.transactions.push({
            description: 'Withdrawal',
            amount: -parseFloat(amount),
            date: new Date()
        });

        await wallet.save();

        res.json({
            success: true,
            message: 'Withdrawal successful',
            wallet: {
                balance: wallet.balance,
                lastTransaction: wallet.transactions[wallet.transactions.length - 1]
            }
        });

    } catch (error) {
        console.error('Error processing withdrawal:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing withdrawal',
            error: error.message
        });
    }
});

// New route for booking a tour
router.post('/wallet/book-tour', async (req, res) => {
    try {
        const { amount, tourName } = req.body; // Expecting amount and tourName in the request body
        const user = await User.findOne({});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found'
            });
        }

        let wallet = await Wallet.findOne({ userId: user._id });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found'
            });
        }

        // Check for sufficient funds
        if (wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient funds'
            });
        }

        // Deduct the amount from the wallet
        wallet.balance -= parseFloat(amount);
        wallet.transactions.push({
            description: `Booking for ${tourName}`,
            amount: -parseFloat(amount),
            date: new Date()
        });

        await wallet.save();

        // Add booking to the booking history
        const booking = new Booking({
            userId: user._id,
            tourName: tourName,
            amount: amount,
            date: new Date()
        });
        await booking.save();

        res.json({
            success: true,
            message: 'Booking successful',
            wallet: {
                balance: wallet.balance,
                lastTransaction: wallet.transactions[wallet.transactions.length - 1]
            }
        });

    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing booking',
            error: error.message
        });
    }
});

module.exports = router;