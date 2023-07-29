const mongoose = require("mongoose");

/** 
 * Records split payment and request payment status and history 
*/

const RequestPaymentSchema = new mongoose.Schema({
  // account requesting payment
  accountNumber: { type: BigInt, required: true },
  // transctions will be created with Pending status and added to this
  requestedTransactions: [mongoose.Types.ObjectId]
})