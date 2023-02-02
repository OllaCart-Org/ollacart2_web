const express = require('express');
const router = express.Router();

const { getProductsByClientSecret, getOrders } = require('../controllers/order.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/order/productsbyclientsecret', Auth, getProductsByClientSecret);



router.post('/admin/getorders', Auth, isAdmin, getOrders );

module.exports = router;
