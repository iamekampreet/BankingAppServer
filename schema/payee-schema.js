const mongoose = require("mongoose");

/**
 * Contains Id of organizations that are registered as payee.
 */
const PayeeSchema = new mongoose.Schema({
  payeeId: { type: mongoose.Types.ObjectId, required: true }
})