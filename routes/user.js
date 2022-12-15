const express = require('express');
const router = express.Router();

const { Auth, isAdmin } = require('../controllers/auth');

const {
  getUsers
} = require('../controllers/user');

router.post('/admin/getusers', Auth, isAdmin, getUsers );

module.exports = router;
