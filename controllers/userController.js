const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Purchase = require("../models/purchaseModel");
const Service = require("../models/serviceModel");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mongoose = require("mongoose");

// CREATE A NEW USER
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// GET ALL USERS
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

// GET USER BY HIS EMAIL ID
exports.getUserByEmail = catchAsync(async (req, res, next) => {
  // the email is present as a query paramter in the url
  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    return next(new AppError("No user found with that email", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// GET USER BY ID
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("No user found with that id", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// UPDATE THE USER
exports.updateUser = catchAsync(async (req, res, next) => {
  let updateData = req.body;

  if (req.file) {
    updateData.photo = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
  }

  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("No user found with that email", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// ADD SERVICE TO USER
exports.addServiceToUser = catchAsync(async (req, res, next) => {
  const { purchasedService, purchasedBy, extraPrice } = req.body;

  // Find the user by ID
  const user = await User.findById(purchasedBy);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Find the service by ID
  const service = await Service.findById(purchasedService);

  if (!service) {
    return next(new AppError("No service found with that ID", 404));
  }

  // Check if the service ID already exists in the user's purchasedServices array
  const serviceExists = user.purchasedServices.some(
    (s) => s.serviceId.toString() === purchasedService
  );

  if (serviceExists) {
    return next(new AppError("Service already purchased", 400));
  }

  // Add the service to the user's purchasedServices array
  const purchasedServiceData = {
    serviceId: service._id,
    serviceName: service.title,
    servicePrice: service.price,
    extraPrice: extraPrice || 0,
    purchasedOn: new Date(),
    serviceStatus: "ongoing",
  };
  user.purchasedServices.push(purchasedServiceData);
  await user.save();

  // Add the user to the service's purchasedBy array
  service.purchasedBy.push(purchasedBy);
  await service.save();

  // Create a new purchase document
  const purchase = await Purchase.create({
    user: user._id,
    service: service._id,
    serviceName: service.title,
    userName: user.name,
    purchasedOn: new Date(),
    serviceStatus: "ongoing",
    servicePrice: service.price,
    extraPrice: extraPrice || 0,
    totalPrice: service.price + (extraPrice || 0),
  });

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
      },
      service: {
        id: service._id,
        title: service.title,
      },
      purchase: {
        id: purchase._id,
        userName: purchase.userName,
        serviceName: purchase.serviceName,
        purchasedOn: purchase.purchasedOn,
        serviceStatus: purchase.serviceStatus,
        totalPrice: purchase.totalPrice,
      },
    },
  });
});

exports.updateServiceStatus = catchAsync(async (req, res, next) => {
  const { userId, serviceId, updatedStatus } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Find the service in the user's purchasedServices array
  const service = user.purchasedServices.find(
    (s) => s.serviceId.toString() === serviceId
  );

  if (!service) {
    return next(
      new AppError(
        "No service found with that ID in user's purchased services",
        404
      )
    );
  }

  // Update the service status in the user's purchasedServices array
  service.serviceStatus = updatedStatus;
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
      },
      service: {
        id: serviceId,
        serviceStatus: updatedStatus,
      },
    },
  });
});

// ADD COMMENT TO A SERVICE - BY A PARTNER
exports.addCommentToService = catchAsync(async (req, res, next) => {
  const { userId, serviceId, comment, commentedBy } = req.body;

  // find the user by the user id
  const user = await User.findById(userId);

  if (!user) return next(new AppError("No user found with that id", 404));

  // find the service in the users purchasedServices field
  const service = user.purchasedServices.find(
    (s) => s.serviceId.toString() === serviceId
  );

  if (!service) {
    return next(new AppError("Users has not purchased this service", 404));
  }

  // add service to the service's comments array
  service.comments.push({
    commentText: comment,
    commentedBy: commentedBy,
    commentedOn: new Date(),
  });

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user._id,
        name: user.name,
      },
      service: {
        id: serviceId,
        comments: service.comments,
      },
    },
  });
});

// DELETE A COMMENT - FOR PARTNERS
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { userId, serviceId, commentId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(serviceId) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    return next(new AppError("Invalid ID format", 400));
  }
  const user = await User.findById(userId);

  if (!user) return next(new AppError("No user found with that id", 404));

  const service = user.purchasedServices.find(
    (s) => s.serviceId.toString() == serviceId
  );
  console.log(service);
  if (!service) return next(new AppError("No service found with that id", 404));

  const comment = service.comments.find((c) => c._id.toString() === commentId);
  console.log(comment);

  if (!comment) return next(new AppError("No comment found with that id", 404));

  // delete the comment
  service.comments = service.comments.filter(
    (c) => c._id.toString() !== commentId
  );

  await user.save();
  res.status(200).json({
    status: "success",
    message: "comment deleted successfully",
  });
});
