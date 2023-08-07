const express = require("express");
const router = express.Router();

const payBillController = require("../controllers/pay-bill-controller");

router.route("/:userId").post(payBillController.payBill);

router.route("/payee").get(payBillController.payee);

router
  .route("/updateUserPayee/:userId")
  .post(payBillController.updateUserPayee);

router
  .route("/upcoming-payments/:userId")
  .get(payBillController.upcomingPayments);

module.exports = router;
