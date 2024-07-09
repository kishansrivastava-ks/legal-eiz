const express = require("express");
const serviceController = require("../controllers/serviceController");

const router = express.Router();

router
  .route("/")
  .post(serviceController.createService)
  .get(serviceController.getAllServices);

router.route("/:id").get(serviceController.getServiceById);

module.exports = router;
