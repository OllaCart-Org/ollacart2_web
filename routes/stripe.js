const express = require('express');
const router = express.Router();

const { fetchPurchaseLink, createPaymentIntent, receiveWebhook } = require('../controllers/stripe');
const { Auth } = require('../controllers/auth');

router.post('/stripe/fetchpurchaselink', Auth, fetchPurchaseLink);
router.post('/stripe/createpaymentintent', Auth, createPaymentIntent);

router.post('/stripe/webhook', Auth, receiveWebhook);


module.exports = router;