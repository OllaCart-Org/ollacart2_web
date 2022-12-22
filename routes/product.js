const express = require('express');
const router = express.Router();

const { create, remove, productById, listBySearch, share, getCarts, putCart } = require('../controllers/product');
const { Auth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/product/create', create);
router.post('/product/remove/:productId', remove);

router.post('/products/by/search', Auth, listBySearch);
router.post('/share/:productId', share);
router.post('/putcart/:productId', putCart);

router.param('userId', userById);
router.param('productId', productById);


router.post('/admin/getcarts', Auth, isAdmin, getCarts );

module.exports = router;
