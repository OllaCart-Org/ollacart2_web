const express = require('express');
const router = express.Router();

const { Auth, isAdmin } = require('../controllers/auth.controller');

const {
  getUsers
} = require('../controllers/user.controller');

router.post('/admin/getusers', Auth, isAdmin,  getUsers );

module.exports = router;
