const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  const body = req.body;

  res.send('Birds home page')
})

module.exports = router