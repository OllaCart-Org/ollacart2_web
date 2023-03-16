const express = require('express');
const router = express.Router();

const { orderById, getProductsByClientSecret, getOrders, updateOrderStatusByProduct, updateShippingNote, getOrderedProducts, getOrdersByUser } = require('../controllers/order.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/order/productsbyclientsecret', Auth, getProductsByClientSecret);
router.post('/order/getorderedproducts', Auth, getOrderedProducts);
router.post('/order/getordersbyuser', Auth, getOrdersByUser);


router.post('/admin/getorders', Auth, isAdmin, getOrders );
router.post('/order/updateorderstatusbyproduct', Auth, isAdmin, updateOrderStatusByProduct);
router.post('/order/updateshippingnote/:orderId', Auth, isAdmin, updateShippingNote);

router.param('orderId', orderById);

module.exports = router;
