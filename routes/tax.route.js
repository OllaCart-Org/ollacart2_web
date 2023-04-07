const express = require('express');
const router = express.Router();

const { update, getTaxes } = require('../controllers/tax.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/tax/update', Auth, isAdmin, update);

router.post('/admin/gettaxes', Auth, isAdmin, getTaxes );


module.exports = router;
