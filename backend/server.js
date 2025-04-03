const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const membershipRoutes = require("./routes/membership");

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Allow requests from this origin
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // If you need to send cookies or HTTP authentication
  })
);

// Middleware to parse JSON
app.use(express.json());
app.use("/api/memberships", membershipRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the RoamBuddy API");
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const walletRoutes = require("./routes/Wallet");
app.use("/api", walletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
