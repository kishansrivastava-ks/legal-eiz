const mongoose = require("mongoose");
const app = require("./app");

const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
// Config
dotenv.config({ path: "./config/config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//   twilio instance
/*
const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// signup route
router.post("/signup", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Send OTP via Twilio
    await twilio.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phoneNumber,
    });

    // Save user with OTP
    const newUser = new User({ phoneNumber, otp });
    await newUser.save();

    res
      .status(201)
      .json({ message: "OTP sent successfully", userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// VERIFY OTP AFTER SIGN UP
router.post("/verify", async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp === otp) {
      // Verify the user
      user.verified = true;
      await user.save();
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ message: "Incorrect OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verified) {
      return res.status(401).json({ message: "User not verified" });
    }

    // You might want to generate a JWT token here or other authentication mechanisms
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
*/
