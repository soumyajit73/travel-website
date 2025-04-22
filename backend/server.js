const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const membershipRoutes = require("./routes/membership");
const bookingRoutes = require('./routes/booking');

const app = express();
dotenv.config();
// In your backend server.js
app.use(
  cors({
    origin: "http://localhost:3000", // Update this to match your frontend port
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use("/api/memberships", membershipRoutes);
app.use('/api', bookingRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the RoamBuddy API");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const walletRoutes = require("./routes/wallet");
app.use("/api", walletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
