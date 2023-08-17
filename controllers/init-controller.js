const { AccountType } = require("../enums/AccountType");
const { CardType } = require("../enums/CardType");
const { MainAccountType } = require("../enums/MainAccountType");
const { StatusType } = require("../enums/StatusType");
const Payee = require("../schema/payee-schema");
const User = require("../schema/user-schema");
const bcrypt = require("bcryptjs");

const init = async (req, res) => {
  const password = await bcrypt.hash(`strong-password`, 12);
  const securityCode = await bcrypt.hash(`123`, 12);

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
    accounts: [
      {
        accountNumber: 1,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 20000.0,
      },
      {
        accountNumber: 2,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 100000.43,
      },
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1111222233334444",
        expiryDate: new Date(2024, 5, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 5000,
        accountBalance: 1500,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "0000111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300,
      },
    ],
  });

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
    accounts: [
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
      },
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1111222233334444",
        expiryDate: new Date(2024, 5, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 5000,
        accountBalance: 1500,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "0000111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300,
      },
    ],
  });

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
    accounts: [
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
      },
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1111222233334444",
        expiryDate: new Date(2024, 5, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 5000,
        accountBalance: 1500,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "3333444455556666",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300,
      },
    ],
  });

  const userHumber = new User({
    firstName: "Humber College Institute of Technology & Advanced",
    lastName: "Learning",
    email: "santoshdhakal.pro@gmail.com",
    password: password,
    address: "205 Humber College Blvd, Etobicoke, ON, Canada",
    phone: "+16478365800",
    sinNumber: "123456789",
    accountType: MainAccountType.Organization,
    displayName: "Humber College",
    accounts: [
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
      },
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1111222233334444",
        expiryDate: new Date(2024, 5, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 5000,
        accountBalance: 1500,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "1234111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300,
      },
    ],
  });

  const userCra = new User({
    firstName: "CRA(Revenue) Tax Amount",
    lastName: "Owing",
    email: "cra@gmail.com",
    password: password,
    address: "Wellington St, Ottawa, ON",
    phone: "+16478365808",
    accountType: MainAccountType.Organization,
    displayName: "CRA(Revenue) Tax Amount Owing",
    accounts: [
      {
        accountNumber: 9,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 8365456.34,
      },
      {
        accountNumber: 10,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 73465435.87,
      },
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1234222233334444",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 5000,
        accountBalance: 1500,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "1234111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300,
      },
    ],
  });

  const userBell = new User({
    firstName: "Bell",
    lastName: "Internet",
    email: "santoshdhakal.pro2@gmail.com",
    password: password,
    address: "1560 Dundas St E C35, Mississauga, ON",
    phone: "+1647836522",
    accountType: MainAccountType.Organization,
    displayName: "Bell Internet",
    accounts: [
      {
        accountNumber: 11,
        accountType: AccountType.Saving,
        status: StatusType.Active,
        accountBalance: 8365456.34,
      },
      {
        accountNumber: 12,
        accountType: AccountType.Checking,
        status: StatusType.Active,
        accountBalance: 73465435.87,
      },
    ],
    cards: [
      {
        cardType: CardType.Debit,
        cardNumber: "1111222233334444",
        expiryDate: new Date(2024, 5, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 5000,
        accountBalance: 1500,
      },
      {
        cardType: CardType.Credit,
        cardNumber: "1234111122223333",
        expiryDate: new Date(2025, 1, 1),
        securityCode: securityCode,
        status: StatusType.Active,
        maxLimit: 1000,
        accountBalance: 300,
      },
    ],
  });

  try {
    await userSantosh.save();
    await userEkam.save();
    await userNatsya.save();
    await userHumber.save();
    await userCra.save();
    await userBell.save();

    const humberCheckingAccountNumber = userHumber.accounts.find(
      (account) => account.accountType === AccountType.Checking
    ).accountNumber;
    const craCheckingAccountNumber = userCra.accounts.find(
      (account) => account.accountType === AccountType.Checking
    ).accountNumber;
    const bellCheckingAccountNumber = userBell.accounts.find(
      (account) => account.accountType === AccountType.Checking
    ).accountNumber;

    const payeeHumber = new Payee({
      payeeId: userHumber._id,
      displayName: userHumber.displayName,
      accountNumber: humberCheckingAccountNumber,
    });

    const payeeCRA = new Payee({
      payeeId: userCra._id,
      displayName: userCra.displayName,
      accountNumber: craCheckingAccountNumber,
    });

    const payeeBell = new Payee({
      payeeId: userBell._id,
      displayName: userBell.displayName,
      accountNumber: bellCheckingAccountNumber,
    });

    await payeeHumber.save();
    await payeeCRA.save();
    await payeeBell.save();

    const santoshPayeeHumber = {
      payeeId: userHumber._id,
      displayName: userHumber.displayName,
      description: "Tuition Payment",
      accountNumber: humberCheckingAccountNumber,
    };
    const santoshPayeeCRA = {
      payeeId: userCra._id,
      displayName: userCra.displayName,
      description: "CRA tax payments",
      accountNumber: craCheckingAccountNumber,
    };
    await User.updateOne(
      { _id: userSantosh._id },
      { $push: { payee: [santoshPayeeCRA, santoshPayeeHumber] } }
    );

    res.send(
      JSON.stringify({
        message: "Added Users to Database",
      })
    );
  } catch (ex) {
    res.send(JSON.stringify(ex.message));
  }
};

exports.init = init;
