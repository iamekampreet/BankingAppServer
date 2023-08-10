const { AccountType } = require("../enums/AccountType");
const { RequestPaymentType } = require("../enums/RequestPaymentType");
const { TransactionStatus } = require("../enums/TransactionStatus");
const { TransactionType } = require("../enums/TransactionType");
const RequestPayment = require("../schema/request-payment-schema");
const Transaction = require("../schema/transaction-schema");
const User = require("../schema/user-schema");
const { validatePhoneNumber } = require("../utils/utils");

exports.splitBill = async (req, res) => {
  console.log(req.body);
  const { friendInfos, note, accountNumber, userEmail } = req.body;

  //TODO do this in a transaction
  let transactions = [];
  const toUser = await User.findOne({ email: userEmail });

  for (const { amount: splitAmount, phoneNumber } of friendInfos) {
    const validPhoneNumber = validatePhoneNumber(phoneNumber);
    const user = await User.findOne({ phone: validPhoneNumber });

    if (user) {
      const friendAccountNumber = user.accounts.find(
        ({ accountType }) => accountType === AccountType.Checking
      ).accountNumber;

      const transaction = new Transaction({
        fromUserId: user._id,
        fromAccountNumber: friendAccountNumber,
        toUserId: toUser._id,
        toAccountNumber: accountNumber,
        amount: splitAmount,
        transactionTime: new Date(),
        status: TransactionStatus.Pending,
      });

      try {
        const savedTransaction = await transaction.save();
        transactions.push(savedTransaction._id);
      } catch (ex) {
        res.status(500).send(ex.message);
        return;
      }
    } else {
      res.status(400).send(
        JSON.stringify({
          message: `User with phone ${phoneNumber} is not a registered user.`,
        })
      );
      return;
    }
  }

  const requestPayment = new RequestPayment({
    userId: toUser._id,
    accountNumber: accountNumber,
    requestedTransactions: transactions,
    note: note,
    type: RequestPaymentType.SplitBill,
  });

  try {
    await requestPayment.save();
    res.json({ message: "Split request successfully sent!" });
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

exports.splitBillHistory = async (req, res) => {
  // const { userId } = req.body;
  // const requestPayments =
};
