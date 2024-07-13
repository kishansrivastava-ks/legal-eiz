const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateAsked: {
    type: Date,
    default: Date.now,
  },
  isAddressed: {
    type: Boolean,
    default: false,
  },
  response: {
    type: String,
    default: "",
  },
  responseDate: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low",
  },
});

const Query = mongoose.model("Query", querySchema);
module.exports = Query;
