const catchAsync = require("../utils/catchAsync");
const Query = require("../models/queryModel");
const AppError = require("../utils/appError");

exports.createQuery = catchAsync(async (req, res, next) => {
  const newQuery = await Query.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      query: newQuery,
    },
  });
});

// GET ALL QUERIES
// exports.getAllQueries = catchAsync(async (req, res, next) => {
//   console.log("getAllQueries called");
//   const queries = await Query.find();
//   console.log("Queries fetched: ", queries);
//   res.status(200).json({
//     status: "success",
//     results: queries.length,
//     data: {
//       queries,
//     },
//   });
// });

exports.getAll = async (req, res, next) => {
  try {
    const queries = await Query.find();

    res.status(200).json({
      status: "success",
      results: queries.length,
      data: {
        queries,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// GET QUERY BY ID
exports.getQueryById = catchAsync(async (req, res, next) => {
  const query = await Query.findById(req.params.id);

  if (!query) {
    return next(new AppError("No query found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      query,
    },
  });
});

// UPDATE QUERY
exports.updateQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!query) {
    return next(new AppError("No query found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      query,
    },
  });
});

// DELETE QUERY
exports.deleteQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findByIdAndDelete(req.params.id);

  if (!query) {
    return next(new AppError("No query found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// MARK QUERY AS ADDRESSED
exports.markAsAddressed = catchAsync(async (req, res, next) => {
  const query = await Query.findByIdAndUpdate(
    req.params.id,
    { isAddressed: true, responseDate: Date.now() },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!query) {
    return next(new AppError("No query found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      query,
    },
  });
});
exports.getAllQueries = catchAsync();
