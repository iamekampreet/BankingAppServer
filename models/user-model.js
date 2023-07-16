const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // unique is used to make index for faster querying, not validation
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true, min: 8 },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  sinNumber: { type: String, required: true, min: 9, max: 9 },

  accounts: {
    chequing: {
      details: {
        enabled: { type: Boolean, required: true },
        accountNumber: { type: String, required: true },
        // to store money just upto two decimal points
        accountBalance: {
          type: Number,
          get: (bal) => (bal / 100).toFixed(2),
          set: (bal) => Math.round(bal * 100),
        },
      },
      incomingTransactions: [
        {
          time: { type: Date, required: true, default: Date.now },
          from: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
          amount: {
            type: Number,
            get: (bal) => (bal / 100).toFixed(2),
            set: (bal) => Math.round(bal * 100),
          },
        },
      ],
      outgoingTransactions: [
        {
          time: { type: Date, required: true, default: Date.now },
          to: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
          amount: {
            type: Number,
            get: (bal) => (bal / 100).toFixed(2),
            set: (bal) => Math.round(bal * 100),
          },
        },
      ],
    },

    savings: {
      details: {
        enabled: { type: Boolean, required: true },
        accountNumber: { type: String, required: true },
        accountBalance: {
          type: Number,
          get: (bal) => (bal / 100).toFixed(2),
          set: (bal) => Math.round(bal * 100),
        },
      },
      incomingTransactions: [
        {
          time: { type: Date, required: true, default: Date.now },
          from: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
          amount: {
            type: Number,
            get: (bal) => (bal / 100).toFixed(2),
            set: (bal) => Math.round(bal * 100),
          },
        },
      ],
      outgoingTransactions: [
        {
          time: { type: Date, required: true, default: Date.now },
          to: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
          amount: {
            type: Number,
            get: (bal) => (bal / 100).toFixed(2),
            set: (bal) => Math.round(bal * 100),
          },
        },
      ],
    },
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

/*
MongoDB has data in this format:

{"_id":{"$oid":"64b325bf8a93b7e899f4e793"},
"firstName": "John",
"lastName": "Doe",
"email": "john.doe@test.com",
"password": "",
"address": "123 Main St., Quebec",
"phone": "123456789",
"sinNumber": "123456789",
"accounts":{
	"chequing":{
		"details":{
			"enabled": true,
			"accountNumber": "123456",
			"accountBalance":2000
			},
		"incomingTransactions":[],
		"outgoingTransactions":[]
		},
	"savings": {
		"details":{
			"enabled":false,
			"accountNumber":"",
			"accountBalance":0
			},
		"incomingTransactions":[],
		"outgoingTransactions":[]
	}
	
}
}
*/
