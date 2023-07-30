const { AccountType } = require("../enums/AccountType");
const { CardType } = require("../enums/CardType");
const { MainAccountType } = require("../enums/MainAccountType");
const { StatusType } = require("../enums/StatusType");
const User = require("../schema/user-schema")
const bcrypt = require("bcryptjs");

const init = async (req, res) => {

  const password =  await bcrypt.hash(`strong-password`, 12)
  const securityCode = await bcrypt.hash(`123`, 12)

  const userSantosh = new User({
    firstName: "Santosh",
    lastName: "Dhakal",
    email: "santosh.dhakal07@gmail.com",
    password: password,
    address: "1234 Bloor St, Mississauga, ON, Canada",
    phone: "+16478365807",
    sinNumber: "123456789",
    accountType: MainAccountType.Individual,
    displayName: "Santosh Dhakal",
    accounts:[ 
      {
        accountNumber: 1,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 20000.00,
      },
      {
        accountNumber: 2,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 100000.43,
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

  const userEkam = new User({
    firstName: "Ekampreet",
    lastName: "Singh",
    email: "ekampreets007@gmail.com",
    password: password,
    address: "1234 Dundas Street, Mississauga, ON, Canada",
    phone: "+19059237745",
    sinNumber: "123456789",
    accountType: MainAccountType.Business,
    displayName: "Ekampreet Singh",
    accounts:[ 
      {
        accountNumber: 3,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 4567.44,
      },
      {
        accountNumber: 4,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 654765.23,
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

  const userNatsya = new User({
    firstName: "Alla-Anastasiia",
    lastName: "Gnatkiv",
    email: "alla.gnatkiv@gmail.com",
    password: password,
    address: "1234 Lakeshore Rd E, Mississauga, ON, Canada",
    phone: "+14372611240",
    sinNumber: "123456789",
    accountType: MainAccountType.Individual,
    displayName: "Alla-Anastasiia Gnatkiv",
    accounts:[ 
      {
        accountNumber: 5,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 654356.43,
      },
      {
        accountNumber: 6,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 345324.23,
      }
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "2222333344445555",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "3333444455556666",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300
      }
    ]
  })

  const userHumber = new User({
    firstName: "Humber College Institute of Technology & Advanced Learning",
    email: "santoshdhakal.pro@gmail.com",
    password: password,
    address: "205 Humber College Blvd, Etobicoke, ON, Canada",
    phone: "+16478365807",
    sinNumber: "123456789",
    accountType: MainAccountType.Organization ,
    displayName: "Humber College",
    accounts:[ 
      {
        accountNumber: 7,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 8365456.34,
      },
      {
        accountNumber: 8,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 73465435.87,
      }
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1234222233334444",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "1234111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300
      }
    ]
  })

  try {
    await userSantosh.save()
    await userEkam.save()
    await userNatsya.save()
    await userHumber.save()

    res.send(JSON.stringify({
      message: "Added Users to Database"
    }))
  } catch (ex) {
    res.send(JSON.stringify(ex.message))
  }
}

exports.init = init