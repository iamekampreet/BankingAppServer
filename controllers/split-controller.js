const { AccountType } = require("../enums/AccountType")
const { TransactionStatus } = require("../enums/TransactionStatus")
const { TransactionType } = require("../enums/TransactionType")
const RequestPayment = require("../schema/request-payment-schema")
const Transaction = require("../schema/transaction-schema")
const User = require("../schema/user-schema")
const { validatePhoneNumber } = require("../utils/utils")

exports.splitBill = async (req, res) => {
  const { friendInfos, note, accountNumber } = req.body

  //TODO do this in a transaction
  //TODO implement push notification
  let transactions = []

  for (const { amount: splitAmount, phoneNumber } of friendInfos) {
    const validPhoneNumber = validatePhoneNumber(phoneNumber)
    const user = await User.findOne({ phone: validPhoneNumber })

    if (user) {
      const friendAccountNumber = 
        user.accounts
          .find(({ accountType }) => accountType === AccountType.Checking)
          .accountNumber

      const transaction = new Transaction({
        accountNumber: friendAccountNumber,
        transactionType: TransactionType.Credit,
        transactionToFrom: accountNumber,
        amount: splitAmount,
        transactionTime: new Date(),
        status: TransactionStatus.Pending
      })

      try {
        const savedTransaction = await transaction.save()
      } catch(ex) {
        res.status(500).send(ex.message)
      }
      
      transactions.push(savedTransaction._id)
    } else {
      res.status(400).send(JSON.stringify({ message: `User with phone ${phoneNumber} is not a registered user.`}))
    }
  }

  const requestPayment = new RequestPayment({
    accountNumber: accountNumber,
    requestedTransactions: transactions,
    note: note
  })

  try {
    await requestPayment.save()
  } catch (ex) {
    res.status(500).send(ex.message)
  }

  res.json({ message: "Split request successfully sent!"})
}

