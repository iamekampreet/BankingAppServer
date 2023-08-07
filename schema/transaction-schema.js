const { mongoose } = require("mongoose");

/*
    My Assumptions;
    - Any transaction performed using debit card will be an checking account transaction

    - Transactions types;
        - saving to checking(same account)
        - checking to saving(same account)
        - debit/checking to another user's checking account
        - credit to another user(business or regular) checking account
*/

/*
    - This collection will be huge, so we can create an index on accountNumber 
*/

const TransactionSchema = new mongoose.Schema({
  // to make querying transaction schema easier
  fromUserId: { type: mongoose.Types.ObjectId, required: true },
  // origin from user can be checking, saving/debit, credit
  fromAccountNumber: { type: Number, required: true },
  // will be added if checking account transaction was initiated from debit card
  cardNumber: { type: BigInt, required: false },

  toUserId: { type: mongoose.Types.ObjectId, required: true },
  // debit(incoming) or credit(outgoing)

  // [*UPDATE*] transaction will always represent credit
  // To check for debit transactions we can query the toUserId, toAccountNumber
  // transactionType: { type: Number, required: true },

  toAccountNumber: { type: Number, required: true },
  amount: {
    type: Number,
    get: (bal) => bal.toFixed(2),
    required: true,
  },
  transactionTime: { type: Date, required: true },
  // pending/complete: will be used in split bill and request payment features
  status: { type: String, required: true },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
