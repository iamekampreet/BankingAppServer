const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");
const config = require("./utils/config");

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

mongoose
  .connect(config.db.uri, config.db.options)
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server listening at port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));
