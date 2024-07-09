const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Partner = require("../models/partnerModel");

exports.createPartner = catchAsync(async (req, res, next) => {
  const newPartner = await Partner.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      partner: newPartner,
    },
  });
});

exports.getAllPartners = catchAsync(async (req, res, next) => {
  const partners = await Partner.find();
  res.status(200).json({
    status: "success",
    data: {
      partners,
    },
  });
});

exports.getPartnerByEmail = catchAsync(async (req, res, next) => {
  const partner = await Partner.findOne({ email: req.params.email });
  if (!partner)
    return next(new AppError("No partner found with that email", 404));
  res.status(200).json({
    status: "success",
    data: {
      partner,
    },
  });
});
