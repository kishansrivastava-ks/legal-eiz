const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: [true, "Name must be specified"],
  },
  email: {
    type: "String",
    required: [true, "Email must be specified"],
  },
  role: {
    type: "String",
    default: "customer",
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
