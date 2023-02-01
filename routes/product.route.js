const express = require('express');
const router = express.Router();

const { create, update, updateSequence, remove, productById, listBySearch, getCarts } = require('../controllers/product.controller');
const { getAnalytics } = require('../controllers/admin.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');
const { userById } = require('../controllers/user.controller');

router.post('/product/create', create);
router.post('/product/update/:productId', update);
router.post('/product/update_sequence', updateSequence);
router.post('/product/remove/:productId', remove);

router.post('/products/by/search', Auth, listBySearch);
// router.post('/share/:productId', share);
// router.post('/putcart/:productId', putCart);

router.param('userId', userById);
router.param('productId', productById);


router.post('/admin/getcarts', Auth, isAdmin, getCarts );
router.post('/admin/getanalytics', Auth, isAdmin, getAnalytics );



module.exports = router;
