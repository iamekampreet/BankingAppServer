const express = require("express");
const router = express.Router();

const payBillController = require("../controllers/pay-bill-controller");

router.route("/").post(payBillController.payBill);

router.route("/payee").get(payBillController.payee);

router.route("/updateUserPayee").post(payBillController.updateUserPayee);

router.route("/upcoming-payments").get(payBillController.upcomingPayments);

router.route("/stop-payments").post(payBillController.stopPayment);

module.exports = router;
