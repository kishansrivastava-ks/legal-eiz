const mongoose = require("mongoose");

// Define the schema for the form data
const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Assuming email should be unique
  },
  phone: {
    type: String,
  },
  state: {
    type: String,
  },
  occupation: {
    type: String,
  },
  message: {
    type: String,
  },
  //   agreeTerms: {
  //     type: Boolean,
  //     required: true,
  //   },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema
const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
