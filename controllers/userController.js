const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

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

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    req.body,
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

// finding the user
// if (!user) {
//   return next(new AppError("No user found", 404));
// }
