const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Purchase = require("../models/purchaseModel");

// GET ALL PURCHASES
exports.getAllPurchases = catchAsync(async (req, res, next) => {
  const purchases = await Purchase.find();
  res.status(200).json({
    status: "success",
    results: purchases.length,
    data: {
      purchases,
    },
  });
});
