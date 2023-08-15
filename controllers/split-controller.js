const { startSession } = require("mongoose");
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

  let transactions = [];
  const toUser = await User.findOne({ email: userEmail });

  //authorize user
  if (toUser._id.toString() !== req.userId) {
    res.status(401).send({ message: "Unauthorized access." });
    return;
  }

  const session = await startSession();
  try {
    session.startTransaction();
    for (const { amount: splitAmount, phoneNumber } of friendInfos) {
      const validPhoneNumber = validatePhoneNumber(phoneNumber);
      const user = await User.findOne({ phone: validPhoneNumber });

      console.log(toUser._id.toString());
      console.log(req.userId);
      console.log(user._id);

      //If the user put his own info in the friends sections
      if (user._id.toString() === req.userId) {
        await session.abortTransaction();
        await session.endSession();
        res.status(400).send(
          JSON.stringify({
            message: "User's info cannot be put in friends section.",
          })
        );
        return;
      }

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
          note: note,
        });

        const savedTransaction = await transaction.save();
        transactions.push(savedTransaction._id);
      } else {
        await session.abortTransaction();
        await session.endSession();
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
      requestedDate: new Date(),
      type: RequestPaymentType.SplitBill,
    });

    await requestPayment.save();
    res.json({ message: "Split request successfully sent!" });

    await session.commitTransaction();
    await session.endSession();
  } catch (ex) {
    await session.abortTransaction();
    await session.endSession();
    res.status(500).send(ex.message);
    return;
  }
};

exports.splitBillHistory = async (req, res) => {
  const userId = req.userId;
  try {
    const requestedPayements = await RequestPayment.find({
      userId: userId,
      type: RequestPaymentType.SplitBill,
    });
    const finalReponseJSON = [];
    for (const requestPayment of requestedPayements) {
      const responseJSON = {
        id: requestPayment._id,
        note: requestPayment.note,
        requestedDate: requestPayment.requestedDate,
        requestedTransactions: [],
      };
      for (const transactionId of requestPayment.requestedTransactions) {
        const transaction = await Transaction.findById(transactionId);
        const requestedUser = await User.findById(transaction.fromUserId);

        responseJSON.requestedTransactions.push({
          requestedUserName:
            requestedUser.firstName + " " + requestedUser.lastName,
          amount: transaction.amount,
          status: transaction.status,
          phoneNumber: requestedUser.phone,
        });
      }
      finalReponseJSON.push(responseJSON);
    }
    res.send(finalReponseJSON);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting split bill history");
  }
};

exports.requestedSplit = async (req, res) => {
  const userId = req.userId;

  try {
    const splitBillTransactions = await Transaction.find({
      fromUserId: userId,
      status: TransactionStatus.Pending,
    });

    console.log(splitBillTransactions);

    const requestedSplits = [];

    for (const splitBillTransaction of splitBillTransactions) {
      const toUser = await User.findById(splitBillTransaction.toUserId);

      const requestedSplit = {
        toUserName: toUser.firstName + " " + toUser.lastName,
        transactionId: splitBillTransaction._id,
        amount: splitBillTransaction.amount,
        note: splitBillTransaction.note,
        requestedDate: splitBillTransaction.transactionTime,
      };
      requestedSplits.push(requestedSplit);
    }
    res.send(requestedSplits);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.completeTransaction = async (req, res) => {
  const userId = req.userId;
  const { transactionId } = req.body;

  const transaction = await Transaction.findById(transactionId);

  console.log(transaction);
  console.log(transaction.fromUserId);
  console.log(userId);
  //authorize
  if (transaction.fromUserId.toString() !== userId) {
    res.status(401).send({ message: "Unauthorized operation!" });
    return;
  }
  const session = await startSession();
  try {
    session.startTransaction();

    await User.updateOne(
      {
        _id: transaction.fromUserId,
        "accounts.accountNumber": transaction.fromAccountNumber,
      },
      {
        $inc: { "accounts.$.accountBalance": transaction.amount * -1 },
      }
    );

    await User.updateOne(
      {
        _id: transaction.toUserId,
        "accounts.accountNumber": transaction.toAccountNumber,
      },
      {
        $inc: { "accounts.$.accountBalance": transaction.amount },
      }
    );

    transaction.status = TransactionStatus.Complete;
    transaction.save();

    await session.commitTransaction();
    await session.endSession();
    res.send({ message: "Payment Complete!" });
    return;
  } catch (ex) {
    console.log(ex);
    await session.abortTransaction();
    await session.endSession();
    res.status(500).send("Exception occured!");
    return;
  }
};
