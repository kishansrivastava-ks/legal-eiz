const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

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
