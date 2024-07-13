const express = require("express");
const queryController = require("../controllers/queryController");

const router = express.Router();

router.route("/").post(queryController.createQuery);

router.route("/getAll").get(queryController.getAll);

router
  .route("/:id")
  .get(queryController.getQueryById)
  .patch(queryController.updateQuery)
  .delete(queryController.deleteQuery);

router.route("/:id/addressed").patch(queryController.markAsAddressed);

module.exports = router;
