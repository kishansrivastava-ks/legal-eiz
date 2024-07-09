const express = require("express");
const purchaseController = require("../controllers/purchaseController");

const router = express.Router();

router.route("/").get(purchaseController.getAllPurchases);

module.exports = router;
