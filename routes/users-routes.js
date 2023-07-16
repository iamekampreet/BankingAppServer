const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.post("/signup", usersControllers.signup);

router.post("/login", usersControllers.login);

module.exports = router;
