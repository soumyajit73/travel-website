const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Wallet = require("../models/wallet"); // Make sure path is correct
const User = require("../models/user");

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

    let wallet = await Wallet.findOne({ userId: '67ed91b8573d5e757fe7107a' });

    if (!wallet) {
      wallet = new Wallet({
        userId: '67ed91b8573d5e757fe7107a',
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

    let wallet = await Wallet.findOne({ userId: '67ed91b8573d5e757fe7107a' });

    if (!wallet) {
      wallet = new Wallet({
        userId: '67ed91b8573d5e757fe7107a',
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

// Get summary route
router.get("/wallet/summary", async (req, res) => {
  try {
    const user = await User.findOne({});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    const wallet = await Wallet.findOne({ userId: '67ed91b8573d5e757fe7107a' });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    const summary = {
      currentBalance: wallet.balance,
      monthlyTransactions: wallet.transactions.filter(
        (t) => t.date >= thisMonth
      ).length,
      yearlyTransactions: wallet.transactions.filter((t) => t.date >= thisYear)
        .length,
      totalDeposits: wallet.transactions.reduce(
        (sum, t) => (t.amount > 0 ? sum + t.amount : sum),
        0
      ),
      totalWithdrawals: wallet.transactions.reduce(
        (sum, t) => (t.amount < 0 ? sum + Math.abs(t.amount) : sum),
        0
      ),
    };

    res.json({
      success: true,
      summary: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching summary",
      error: error.message,
    });
  }
});
// Add this route in routes/wallet.js
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

      let wallet = await Wallet.findOne({ userId: '67ed91b8573d5e757fe7107a' });
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

module.exports = router;
