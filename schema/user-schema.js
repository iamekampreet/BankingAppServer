const mongoose = require("mongoose");

// Moved transaction to a different collection
// Mongodb has max document size limit of around 16mb.
// Transaction is an unbounded field, so it will increase
// and the document size will increse with each transaction
// Also, we don't want all the transaction history to be returned when
// we are just querying for the User info. (I'm assuming everything will be returned.)

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // unique is used to make index for faster querying, not validation
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  sinNumber: { type: String, required: true },
  //can be individual, student, business, joint, organization(University, college)
  accountType: { type: Number, required: true },
  //for business users
  displayName: { type: String },
  //for joint-checking like accounts, will refer to other owners
  owners: { type: mongoose.Types.ObjectId, ref: "User", required: false },

  accounts: [
    {
      accountNumber: { type: BigInt, required: true },
      // 1 - Saving, 2 - checking, 3- Joint, 4 - some other future types
      //Int32 (efficient for indexing)
      accountType: { type: Number, required: true },
      enabled: { type: Boolean, required: true },
      accountBalance: {
        type: mongoose.SchemaTypes.Decimal128,
        required: true,
      },
    },
  ],
  //debit card, credit card
  cards: [
    {
      cardType: { type: Number, required: true },
      cardNumber: { type: String, required: true },
      expiryDate: { type: Date, required: true },
      securityCode: { type: String, required: true },
      maxLimit: { type: mongoose.SchemaTypes.Decimal128, required: false },
      accountBalance: {
        type: mongoose.SchemaTypes.Decimal128,
        required: false,
      },
      // active, inactive, blocked
      status: { type: Number, required: true },
      //can add sub types of credit cards like student card, personal, business
    },
  ],
  payee: [
    {
      payeeId: { type: mongoose.Types.ObjectId, required: true},
      description: { type: String, required: false }
    }
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
