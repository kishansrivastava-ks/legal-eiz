// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Service = require("../models/serviceModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

exports.createService = catchAsync(async (req, res, next) => {
  const newService = await Service.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      service: newService,
    },
  });
});
exports.getAllServices = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Service.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  const services = await features.query;

  if (!services) {
    return next(new AppError("No services found", 404));
  }

  res.status(200).json({
    status: "success",
    results: services.length,
    data: {
      services,
    },
  });
});

exports.getServiceById = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError("No service found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });
});
