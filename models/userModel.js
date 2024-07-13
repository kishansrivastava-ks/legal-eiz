const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["user", "partner"],
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  aadhar: {
    type: String,
  },
  pan: {
    type: String,
  },
  purchasedServices: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
      serviceName: {
        type: String,
        required: true,
      },
      servicePrice: {
        type: Number,
        required: true,
      },
      extraPrice: {
        type: Number,
        default: 0,
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
    },
  ],
  photo: {
    data: Buffer,
    contentType: String,
  },
});

// TO AUTOMATICALLY UPDATE THE PURCHASE DOCUMENT WHEN THE purchasedServices FIELD OF THE USER DOCUMENT GETS EDITED
userSchema.pre("save", async function (next) {
  const Purchase = mongoose.model("Purchase");
  if (this.isModified("purchasedServices")) {
    for (const purchasedService of this.purchasedServices) {
      await Purchase.updateOne(
        { user: this._id, service: purchasedService.serviceId },
        {
          serviceStatus: purchasedService.serviceStatus,
          comments: purchasedService.comments,
        }
      );
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
