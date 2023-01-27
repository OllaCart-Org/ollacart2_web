const express = require('express');
const router = express.Router();

const { fetchPurchaseLink } = require('../controllers/stripe');
const { Auth } = require('../controllers/auth');

router.post('/stripe/fetchpurchaselink', Auth, fetchPurchaseLink);



module.exports = router;