const express = require('express');
const router = express.Router();

const { orderById, getProductsByClientSecret, getOrders, updateOrderDetail, getOrderedProducts, getOrdersByUser } = require('../controllers/order.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/order/productsbyclientsecret', Auth, getProductsByClientSecret);
router.post('/order/getorderedproducts', Auth, getOrderedProducts);
router.post('/order/getordersbyuser', Auth, getOrdersByUser);


router.post('/admin/getorders', Auth, isAdmin, getOrders );
router.post('/order/updatedetail/:orderId', Auth, isAdmin, updateOrderDetail);

router.param('orderId', orderById);

module.exports = router;
