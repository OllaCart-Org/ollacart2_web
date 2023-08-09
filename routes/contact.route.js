const express = require('express');
const router = express.Router();

const { sendInvestContact, sendPartnerContact, sendFeedbackContact, getFeedbacks, getInvestorRequests, getPartnerRequests } = require('../controllers/contact.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/contact/invest', sendInvestContact);
router.post('/contact/partner', sendPartnerContact);
router.post('/contact/feedback', sendFeedbackContact);


router.post('/admin/getfeedbacks', Auth, isAdmin, getFeedbacks );
router.post('/admin/getpartnerrequests', Auth, isAdmin, getPartnerRequests );
router.post('/admin/getinvestorrequests', Auth, isAdmin, getInvestorRequests );

module.exports = router;
