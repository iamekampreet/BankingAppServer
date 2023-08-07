const mongoose = require("mongoose");

/**
 * Contains Id of organizations that are registered as payee.
 */
const PayeeSchema = new mongoose.Schema({
  payeeId: { type: mongoose.Types.ObjectId, required: true },
  displayName: { type: String, required: true },
  accountNumber: { type: String, required: true },
});

const Payee = mongoose.model("Payee", PayeeSchema);

module.exports = Payee;
