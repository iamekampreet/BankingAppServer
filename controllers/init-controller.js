const { AccountType } = require("../enums/AccountType");
const { CardType } = require("../enums/CardType");
const { MainAccountType } = require("../enums/MainAccountType");
const { StatusType } = require("../enums/StatusType");
const User = require("../schema/user-schema")
const bcrypt = require("bcryptjs");

const init = async (req, res) => {

  const password =  await bcrypt.hash(`password-santosh`, 12)
  const securityCode = await bcrypt.hash(`123`, 12)

  const userSantosh = new User({
    firstName: "Santosh",
    lastName: "Dhakal",
    email: "santosh.dhakal07@gmail.com",
    password: password,
    address: "1234 Bloor St, Mississauga, ON, Canada",
    phone: "6478365807",
    sinNumber: "123456789",
    accountType: MainAccountType.Individual,
    displayName: "Santosh Dhakal",
    accounts:[ 
      {
        accountNumber: 1,
        accountType: AccountType.Saving,
        enabled: true,
        accountBalance: 20000,
      },
      {
        accountNumber: 2,
        accountType: AccountType.Checking,
        enabled: true,
        accountBalance: 100000,
      }
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1111222233334444",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "0000111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300
      }
    ]
  })

  await userSantosh.save()

  res.send(JSON.stringify({
    status: "Success",
    message: "Added Users to Database"
  }))
}

exports.init = init