const express = require('express');
const router = express.Router();

const { getProductsByClientSecret } = require('../controllers/order');
const { Auth } = require('../controllers/auth');

router.post('/order/productsbyclientsecret', Auth, getProductsByClientSecret);



module.exports = router;
