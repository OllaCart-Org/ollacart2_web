const express = require('express');
const router = express.Router();

const {
  send,
  testEmail
} = require('../controllers/message.controller');

router.post('/message/send', send);

router.post('/test/email', testEmail);

module.exports = router;
