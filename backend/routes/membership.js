const express = require("express");
const mongoose = require("mongoose");
const Membership = require("../models/membership");
const User = require("../models/user");

const router = express.Router();

// Purchase Membership
router.post("/purchase", async (req, res) => {
  const { membershipId, userId } = req.body;
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership)
      return res.status(404).json({ message: "Membership not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.funds < membership.price)
      return res.status(400).json({ message: "Insufficient funds" });

    user.membership = membership.name;
    user.funds -= membership.price;
    await user.save();

    res.json({ message: "Membership purchased" });
  } catch (err) {
    console.error("Error during membership purchase:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
