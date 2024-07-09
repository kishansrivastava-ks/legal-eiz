const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["business", "individual"],
    required: true,
  },
  category: {
    type: String,
    enum: ["documentation", "talkToLawyer", "startup"],
    required: true,
  },
  subcategory: String, // for specific types within each category
  options: [
    {
      optionName: String,
      additionalPrice: Number,
    },
  ],
  talkTime: Number, // only for 'talkToLawyer'
  status: {
    type: String,
    enum: ["ongoing", "renewal", "completed", "closed"],
    default: "ongoing",
  },
  purchasedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
