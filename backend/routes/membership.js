const express = require("express");
const Membership = require("../models/membership");
const User = require("../models/user");
const MembershipLog = require("../models/message"); // Adjust the path as needed

const router = express.Router();

// Purchase Membership
router.post("/purchase", async (req, res) => {
  const { membershipId, userId } = req.body;
  try {
    const membership = await Membership.findById(membershipId);
    if (!membership) return res.status(404).json({ message: "Membership not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.funds < membership.price) return res.status(400).json({ message: "Insufficient funds" });

    user.membership = membership.name;
    user.funds -= membership.price;

    // Create and store the message
    const message = `User ${userId} purchased ${membership.name} membership.`;
    console.log(message); // Log the message

    // Save the log entry
    const logEntry = new MembershipLog({
      userId: user._id,
      membershipId: membership._id,
      message: message
    });
    await logEntry.save();

    await user.save();

    // Send membership details in the response
    res.json({
      message: "Membership purchased",
      membership: {
        name: membership.name,
        price: membership.price,
        benefits: membership.benefits
      }
    });
  } catch (err) {
    console.error('Error during membership purchase:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;