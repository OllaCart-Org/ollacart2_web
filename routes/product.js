const express = require('express');
const router = express.Router();

const {
  create,
  productById,
  remove,
  list,
  listBySearch,
  share
} = require('../controllers/product');
const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/product/create', create);

router.delete('/product/:productId/:userId', requireSignin, isAuth, remove);

router.get('/products', list);
router.post('/products/by/search', listBySearch);
router.post('/share/:productId', share);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
