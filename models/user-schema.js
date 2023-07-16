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
  //can be personal, student, business
  accountType: { type: String, required: true },
  //for business users
  displayName: { type: String },
  // Using only checking and saving will make us limited to these accounts only
  // If we use list we can add other account types like joint checking account
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
      //for joint-checking like accounts, will refer to other owners
      owners: { type: mongoose.Types.ObjectId, ref: "User" },
    },
  ],
  //debit card, credit card
  cards: [
    {
      cardType: { type: String, required: true },
      cardNumber: { type: BigInt, required: true },
      expiryDate: { type: Date, required: true },
      securityCode: { type: String, required: true },
      enabled: { type: Boolean, required: true },
      maxLimit: { type: mongoose.SchemaTypes.Decimal128, required: true },
      accountBalance: {
        type: mongoose.SchemaTypes.Decimal128,
        required: true,
      },
      // active, inactive, blocked
      status: { type: String, required: true },
      //can add sub types of credit cards like student card, personal, business
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
