const express = require('express');
const router = express.Router();

const { sendInvestContact, sendPartnerContact, sendFeedbackContact } = require('../controllers/contact.controller');

router.post('/contact/invest', sendInvestContact);
router.post('/contact/partner', sendPartnerContact);
router.post('/contact/feedback', sendFeedbackContact);

module.exports = router;
