const express = require("express");
const router = express.Router();

const splitController = require("../controllers/split-controller");

router.route("/").post(splitController.splitBill);

router.route("/splitBillHistory").post(splitController.splitBillHistory);

module.exports = router;
