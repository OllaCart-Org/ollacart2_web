const express = require('express');
const router = express.Router();

const { fetchPurchaseLink, createPaymentIntent, createAnonymousUsernamePaymentIntent, receiveWebhook } = require('../controllers/stripe.controller');
const { Auth } = require('../controllers/auth.controller');

router.post('/stripe/fetchpurchaselink', Auth, fetchPurchaseLink);
router.post('/stripe/createpaymentintent', Auth, createPaymentIntent);
router.post('/stripe/createanonymoususernamepaymentintent', Auth, createAnonymousUsernamePaymentIntent);

router.post('/stripe/webhook', Auth, receiveWebhook);


module.exports = router;