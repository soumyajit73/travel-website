const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body; // Ensure username is extracted
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ error: err.message });
    }
  });

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      // Store user ID in a token or session
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
