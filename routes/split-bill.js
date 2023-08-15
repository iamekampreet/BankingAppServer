const express = require("express");
const router = express.Router();

const splitController = require("../controllers/split-controller");

router.route("/").post(splitController.splitBill);

router.route("/history").get(splitController.splitBillHistory);

router.route("/requestedSplit").get(splitController.requestedSplit);

router.route("/completeTransaction").post(splitController.completeTransaction);

module.exports = router;
