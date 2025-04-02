const express = require("express");
const Membership = require("../models/membership");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to check authentication
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Get Memberships
router.get("/", async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Purchase Membership
router.post("/purchase", auth, async (req, res) => {
  const { membershipId } = req.body;
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership)
      return res.status(404).json({ message: "Membership not found" });

    const user = await User.findById(req.user.id);
    if (user.funds < membership.price)
      return res.status(400).json({ message: "Insufficient funds" });

    user.membership = membership.name;
    user.funds -= membership.price;
    await user.save();

    res.json({ message: "Membership purchased" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
