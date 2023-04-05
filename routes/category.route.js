const express = require('express');
const router = express.Router();

const { categoryById, create, update, remove, getCategories } = require('../controllers/category.controller');
const { Auth, isAdmin } = require('../controllers/auth.controller');

router.post('/category/create', Auth, isAdmin, create);
router.post('/category/update/:categoryId', Auth, isAdmin, update);
router.post('/category/remove/:categoryId', Auth, isAdmin, remove);

router.post('/admin/getcategories', Auth, isAdmin, getCategories );

router.param('categoryId', categoryById);

module.exports = router;
