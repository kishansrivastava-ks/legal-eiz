const express = require("express");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const partnerRouter = require("./routes/partnerRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(morgan(`dev`));

app.use(cors());
app.options("*", cors());

app.use(express.json()); // this midleware would help data from body to be put on the request object

app.use("/api/v1/user", userRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/partner", partnerRouter);
app.use("/api/v1/purchase", purchaseRouter);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
