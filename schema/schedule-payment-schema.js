const mongoose = require("mongoose");

/**
 * In pay bill, user can create a payment that can have certain frequency like
 * once, daily, monthy.
 * This schema will hold information about all the scheduled payment.
 * A scheduler will run at certain specified time, go through all the schedule payment
 * and perform the transaction.
 * If the schedule type is once, the scheduler will perform that transaction
 * and remove the schedule from this table.
 * If the schedule type has some other frequency, the scheduler will perform the transaction
 * but will not remove the schedule.
 */

const SchedulePaymentSchema = new mongoose.Schema({
  // account requesting payment
  fromUserId: { type: mongoose.Types.ObjectId, required: true },
  fromAccount: { type: Number, required: true },
  // transctions will be created with Pending status and added to this
  toUserId: { type: mongoose.Types.ObjectId, required: true },
  toAccount: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  frequency: { type: Number, requred: true },
});

const SchedulePayment = mongoose.model(
  "SchedulePayment",
  SchedulePaymentSchema
);

module.exports = SchedulePayment;
