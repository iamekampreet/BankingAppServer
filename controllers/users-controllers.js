const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../schema/user-schema");
const { CardType } = require("../enums/CardType");
const { StatusType } = require("../enums/StatusType");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV.trim()}` });

const signup = async (req, res, next) => {
  const { debitCard, lastName, email, password } = req.body;

  // Checking if user exists in the database or not
  let user;
  try {
    user = await User.findOne({ email }).exec();
  } catch (err) {
    return next(new HttpError(`An error occurred: ${err}`, 500));
  }

  if (!user) {
    return next(
      new HttpError(
        `Email does not exists in our database, please visit nearest branch to create account`,
        422
      )
    );
  }

  // Checking if the user has already Signed Up
  if (user.password) {
    return next(
      new HttpError(`Credentials already exists. Login instead?`, 422)
    );
  }

  // Verifying Debit card and lastName fields
  let isDebitCardValid = true;
  const debitCardFromDB = user.cards.find(
    ({ cardType }) => cardType == CardType.Debit
  );
  if (!!debitCardFromDB && debitCardFromDB.status == StatusType.Active) {
    try {
      isDebitCardValid = debitCard == debitCardFromDB.cardNumber;
    } catch (err) {
      return next(new HttpError("Something went wrong. Please try again", 500));
    }
  }
  if (!isDebitCardValid || lastName !== user.lastName) {
    return next(new HttpError("Invalid credentials.", 403));
  }

  // Generate hashed password to save
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
    return next(new HttpError(`Cannot create the user. Please try again`, 500));
  }
  user.password = hashedPassword;

  // Save the user
  try {
    user.save();
  } catch (err) {
    return next(new HttpError(`Error occurred: ${err}`, 500));
  }

  // Generate JWT
  let token;
  try {
    token = jwt.sign({ userId: user.id, email }, process.env.JWT_TOKEN_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    return next(new HttpError(`Error occurred: ${err}`, 500));
  }

  res.status(201).json({ token, user: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user exists in the database or not
  let user;
  try {
    user = await User.findOne({ email }).exec();
  } catch (err) {
    return next(new HttpError(`An error occurred: ${err}`, 500));
  }

  if (!user) {
    return next(
      new HttpError(
        `Email does not exists in our database, please visit nearest branch to create account`,
        422
      )
    );
  }

  // Checking if the user has Signed Up or not
  if (!user.password) {
    return next(
      new HttpError(`Credentials do not exist. Signup instead?`, 422)
    );
  }

  let doPasswordsMatch;
  try {
    doPasswordsMatch = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(new HttpError("Something went wrong. Please try again", 500));
  }
  if (!doPasswordsMatch) {
    return next(new HttpError("Wrong password. Please try again", 422));
  }

  // Generate JWT
  let token;
  try {
    token = jwt.sign({ userId: user.id, email }, process.env.JWT_TOKEN_KEY, {
      expiresIn: "1h",
    });
  } catch (err) {
    return next(new HttpError(`Error occurred: ${err}`, 500));
  }

  res.json({ token, user: user });
};

exports.signup = signup;
exports.login = login;
