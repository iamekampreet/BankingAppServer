const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const splitBillRoutes = require("./routes/split-bill");

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const HttpError = require("./models/http-error");
require("./utils/database")

const initController = require("./controllers/init-controller")

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/splitBill", splitBillRoutes)

app.get('/init', initController.init)

// When a route wasn't found for the path requested
app.use((req, res, next) => {
  next(new HttpError("Could not find this route", 404));
});

// Express's default error handling middleware
app.use((error, req, res, next) => {
  // Checks if a response has been sent yet, as you can only send one res per req
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500) //500 stands for server error
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server listening at port ${process.env.PORT || 5001}`);
});