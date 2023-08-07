const express = require("express");
const router = express.Router();

const betweenAccountsController = require("../controllers/between-accounts-controller");

router
  .route("/:userId")
  .post(betweenAccountsController.transferBetweenAccounts);

router
  .route("/upcoming-payments/:userId")
  .get(betweenAccountsController.upcomingPayments);

module.exports = router;
