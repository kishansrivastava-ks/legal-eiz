const express = require("express");
const userController = require("../controllers/userController");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route("/add-service").post(userController.addServiceToUser);

router.route("/update-service-status").post(userController.updateServiceStatus);

router.route("/add-comment").post(userController.addCommentToService);

router.route("/delete-comment").post(userController.deleteComment);

router
  .route("/:email")
  .get(userController.getUserByEmail)
  .patch(upload.single("photo"), userController.updateUser);

router.route("/:id").get(userController.getUserById);

module.exports = router;
