const { ObjectId } = require("bson");
const Payee = require("../schema/payee-schema");
const User = require("../schema/user-schema");
const SchedulePayment = require("../schema/schedule-payment-schema");
const {
  dateofNextMonday,
  dateOfFirstDayOfNextMonth,
  isScheduledDateToday,
} = require("../utils/utils");
const { Frequency } = require("../enums/Frequency");
const { startSession } = require("mongoose");
const Transaction = require("../schema/transaction-schema");
const { TransactionStatus } = require("../enums/TransactionStatus");

exports.payBill = async (req, res) => {
  const payment = req.body;
  const userId = req.userId;

  console.log(userId, payment);

  const schedulePayment = {
    fromUserId: new ObjectId(userId),
    fromAccount: payment.from,
    toUserId: new ObjectId(payment.to.payeeId),
    toAccount: payment.to.accountNumber,
    amount: payment.amount,
    date: new Date(payment.date),
    frequency: payment.frequency,
  };

  const user = await User.findById(userId).exec();
  if (!user) {
    res.status(400).send({ message: `User not found ${userId}` });
    return;
  }
  console.log(user);
  console.log(user.accounts);

  //check if frequency is once and date is today
  if (
    isScheduledDateToday(schedulePayment.date) &&
    schedulePayment.frequency === Frequency.Once
  ) {
    const account = user.accounts.find(
      (account) => account.accountNumber === schedulePayment.fromAccount
    );
    if (account.accountBalance < schedulePayment.amount) {
      res.status(400).send({ message: `Insufficient Amount.` });
      return;
    }
    //then perform the transaction immediately and record in transaction
    const session = await startSession();
    try {
      session.startTransaction();

      await User.updateOne(
        {
          _id: schedulePayment.fromUserId,
          "accounts.accountNumber": schedulePayment.fromAccount,
        },
        {
          $inc: { "accounts.$.accountBalance": schedulePayment.amount * -1 },
        }
      );

      await User.updateOne(
        {
          _id: schedulePayment.toUserId,
          "accounts.accountNumber": schedulePayment.toAccount,
        },
        {
          $inc: { "accounts.$.accountBalance": schedulePayment.amount },
        }
      );

      await new Transaction({
        fromUserId: new ObjectId(userId),
        fromAccountNumber: schedulePayment.fromAccount,
        toUserId: new ObjectId(schedulePayment.toUserId),
        toAccountNumber: schedulePayment.toAccount,
        amount: schedulePayment.amount,
        transactionTime: new Date(),
        status: TransactionStatus.Complete,
      }).save();

      const updatedUser = await User.findById(userId).exec();
      await session.commitTransaction();
      await session.endSession();
      res.send({ message: "Payment Complete!", user: updatedUser });
      return;
    } catch (ex) {
      console.log(ex);
      await session.abortTransaction();
      await session.endSession();
      res.status(500).send("Exception occured!");
      return;
    }
  }

  try {
    await new SchedulePayment(schedulePayment).save();
    res.send({ message: "Schedule Payment created!" });
  } catch (ex) {
    console.log(ex);
    res.send(500).send({ message: `Error: ${ex.message}` });
  }
};

exports.payee = async (req, res) => {
  const allPayee = await Payee.find();
  console.log(allPayee);
  res.json(allPayee);
};

exports.updateUserPayee = async (req, res) => {
  const userId = req.userId;
  const newPayee = req.body;
  console.log(userId, newPayee);
  const user = await User.findOne({ _id: userId });
  console.log(user);
  if (!user) {
    res.status(400).send({ message: "User not found" });
    return;
  }
  const commonPayee = user.payee.find((p) =>
    p.payeeId.equals(new ObjectId(newPayee.payeeId))
  );
  if (commonPayee) {
    res.status(400).send({ message: "Payee Already exists" });
    return;
  }

  try {
    await User.updateOne({ _id: userId }, { $push: { payee: newPayee } });
    const updatedUser = await User.findOne({ _id: userId });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.upcomingPayments = async (req, res) => {
  const userId = req.userId;

  const scheduledPayments = await SchedulePayment.find({
    fromUserId: new ObjectId(userId),
  });
  const responsePromise = scheduledPayments.map(async (scheduledPayment) => {
    const payee = await Payee.findOne({
      accountNumber: scheduledPayment.toAccount,
    });
    let date = scheduledPayment.date.toISOString().split("T")[0];
    if (scheduledPayment.frequency === Frequency.Weekly) {
      date = dateofNextMonday();
    } else if (scheduledPayment.frequency === Frequency.Monthly) {
      date = dateOfFirstDayOfNextMonth();
    }

    return {
      scheduledPaymentId: scheduledPayment._id,
      to: payee,
      amount: scheduledPayment.amount,
      date: date,
      frequency: scheduledPayment.frequency,
    };
  });
  const response = await Promise.all(responsePromise);

  console.log(response);
  res.send(JSON.stringify(response));
};

exports.stopPayment = async (req, res) => {
  const { scheduledPaymentId } = req.body;

  console.log(req.body);
  console.log(scheduledPaymentId);
  try {
    const result = await SchedulePayment.deleteOne({ _id: scheduledPaymentId });
    if (result.deletedCount === 0) {
      res.status(404).send({ message: `Schedule not found!` });
    } else {
      res.send({ message: `Schedule removed!` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
