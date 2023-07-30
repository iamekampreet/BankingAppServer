const express = require('express')
const router = express.Router()

const splitController = require('../controllers/split-controller')

router.route('/')
  .post(splitController.splitBill)

module.exports = router