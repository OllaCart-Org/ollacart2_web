const express = require('express');
const router = express.Router();

const { getProductsByClientSecret, getOrders, updateOrderStatusByProduct } = require('../controllers/order.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/order/productsbyclientsecret', Auth, getProductsByClientSecret);



router.post('/admin/getorders', Auth, isAdmin, getOrders );
router.post('/order/updateorderstatusbyproduct', Auth, isAdmin, updateOrderStatusByProduct);

module.exports = router;
