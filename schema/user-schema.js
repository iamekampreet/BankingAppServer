const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  // unique is used to make index for faster querying, not validation
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  sinNumber: { type: String, required: false },
  //can be individual, student, business, joint, organization(University, college)
  accountType: { type: Number, required: true },
  //for business users
  displayName: { type: String },
  //for joint-checking like accounts, will refer to other owners
  owners: { type: mongoose.Types.ObjectId, ref: "User", required: false },

  accounts: [
    {
      accountNumber: { type: Number, required: true },
      // 1 - Saving, 2 - checking, 3- Joint, 4 - some other future types
      //Int32 (efficient for indexing)
      accountType: { type: Number, required: true },
      status: { type: Number, required: true },
      accountBalance: {
        type: Number,
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
      maxLimit: { type: Number, required: false },
      accountBalance: {
        type: Number,
        required: false,
      },
      // active, inactive, blocked
      status: { type: Number, required: true },
      //can add sub types of credit cards like student card, personal, business
    },
  ],
  payee: [
    {
      payeeId: { type: mongoose.Types.ObjectId, required: true },
      displayName: { type: String, required: true },
      description: { type: String, required: false },
      accountNumber: { type: Number, required: true },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
