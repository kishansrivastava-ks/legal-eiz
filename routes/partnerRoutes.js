const express = require("express");
const partnerController = require("../controllers/partnerController");

const router = express.Router();

router.route("/").post(partnerController.createPartner);

router.route("/:email").get(partnerController.getPartnerByEmail);

module.exports = router;
