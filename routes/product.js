const express = require('express');
const router = express.Router();

const {
  create,
  productById,
  listBySearch,
  share
} = require('../controllers/product');
const { Auth } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/product/create', create);

router.post('/products/by/search', Auth, listBySearch);
router.post('/share/:productId', share);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
