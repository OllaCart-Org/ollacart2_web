const express = require('express');
const router = express.Router();

const {
  create,
} = require('../controllers/extension');

router.post('/extension/create', create);

module.exports = router;
