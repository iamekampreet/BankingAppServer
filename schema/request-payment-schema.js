const mongoose = require("mongoose");

/**
 * Records split payment and request payment status and history
 */

const RequestPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  // account requesting payment
  accountNumber: { type: Number, required: true },
  // transctions will be created with Pending status and added to this
  requestedTransactions: [mongoose.Types.ObjectId],
  note: { type: String, required: false },
  requestedDate: { type: Date, required: true },
  // split bill = 0/normal request payment = 1
  type: { type: Number, required: true },
});

const RequestPayment = mongoose.model("RequestPayment", RequestPaymentSchema);

module.exports = RequestPayment;
