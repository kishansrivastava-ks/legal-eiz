const express = require("express");
const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const partnerRouter = require("./routes/partnerRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const queryRouter = require("./routes/queryRoutes");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const bodyParser = require("body-parser");

const app = express();

// Increasing the payload size limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500 })
);

app.use(morgan(`dev`));

app.use(cors());
app.options("*", cors());

app.use(express.json()); // this midleware would help data from body to be put on the request object

app.use("/api/v1/user", userRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/partner", partnerRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/query", queryRouter);

// handling unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
