const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  purchasedOn: {
    type: Date,
    default: Date.now,
  },
  serviceStatus: {
    type: String,
    enum: ["ongoing", "completed", "renewal", "closed"],
    default: "ongoing",
  },
  servicePrice: {
    type: Number,
    required: true,
  },
  extraPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  comments: [
    {
      commentText: {
        type: String,
        required: true,
      },
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      commentedOn: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

purchaseSchema.pre("save", async function (next) {
  if (!this.isModified("serviceStatus")) return next();

  const User = mongoose.model("User");
  const user = await User.findById(this.user).lean();

  if (!user) {
    return next(new Error("No user found with that ID"));
  }

  const purchasedService = user.purchasedServices.find(
    (s) => s.serviceId.toString() === this.service.toString()
  );

  if (purchasedService) {
    this.serviceStatus = purchasedService.serviceStatus;
  }

  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;
