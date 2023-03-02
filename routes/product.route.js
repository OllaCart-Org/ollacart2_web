const express = require('express');
const router = express.Router();

const { create, update, updateSequence, remove, productById, listBySearch, getCarts, updateLogo, forkProduct, thumbup, thumbdown } = require('../controllers/product.controller');
const { getAnalytics } = require('../controllers/admin.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');
const { userById } = require('../controllers/user.controller');

router.post('/product/create', create);
router.post('/product/update/:productId', Auth, update);
router.post('/product/update_sequence', Auth, updateSequence);
router.post('/product/remove/:productId', Auth, remove);
router.post('/product/updatelogo/:productId', Auth, updateLogo)

router.post('/product/fork/:productId', Auth, forkProduct)
router.post('/product/thumbup/:productId', Auth, thumbup)
router.post('/product/thumbdown/:productId', Auth, thumbdown)

router.post('/products/by/search', Auth, listBySearch);
// router.post('/share/:productId', share);
// router.post('/putcart/:productId', putCart);

router.param('userId', userById);
router.param('productId', productById);


router.post('/admin/getcarts', Auth, isAdmin, getCarts );
router.post('/admin/getanalytics', Auth, isAdmin, getAnalytics );



module.exports = router;
