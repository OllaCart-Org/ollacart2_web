const express = require('express');
const router = express.Router();

const { fetchPurchaseLink, createPaymentIntent } = require('../controllers/stripe');
const { Auth } = require('../controllers/auth');

router.post('/stripe/fetchpurchaselink', Auth, fetchPurchaseLink);
router.post('/stripe/createpaymentintent', Auth, createPaymentIntent);


module.exports = router;