const express = require('express');
const router = express.Router();

const {
  send,
  testEmail,
  testApi
} = require('../controllers/message.controller');

router.post('/message/send', send);

router.post('/test/email', testEmail);

router.post('/test/api', testApi);

module.exports = router;
