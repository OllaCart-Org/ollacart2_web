const express = require('express');
const router = express.Router();

const {
  send
} = require('../controllers/message');

router.post('/message/send', send);

module.exports = router;
