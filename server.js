const express = require("express");
const bodyParser = require("body-parser");

const usersRoutes = require("./routes/users-routes");
const splitBillRoutes = require("./routes/split-bill");
const payBillRoutes = require("./routes/pay-bill");
const betweenAccountsRoutes = require("./routes/between-accounts");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV.trim()}` });

const HttpError = require("./models/http-error");
require("./utils/database");

const initController = require("./controllers/init-controller");
const { cors } = require("./middleware/cors");
const { tokenValidator } = require("./middleware/token-validator");

const app = express();

app.use(bodyParser.json());
app.use(cors);

app.get("/init", initController.init);
app.get("/test", (req, res) => {
  res.send("All good!");
});
app.use("/api/users", usersRoutes);

app.use(tokenValidator);
app.use("/api/between-accounts", betweenAccountsRoutes);
app.use("/api/split-bill", splitBillRoutes);
app.use("/api/pay-bill", payBillRoutes);

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
