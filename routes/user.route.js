const express = require('express');
const router = express.Router();

const { Auth, isAdmin, AuthWithEmail } = require('../controllers/auth.controller');

const { getUsers, inviteUser, followUser, unFollowUser, getAccountSettings, updateAccountSettings } = require('../controllers/user.controller');

router.post('/user/follow', Auth, AuthWithEmail, followUser);
router.post('/user/unfollow', Auth, unFollowUser);

router.post('/user/invite', Auth, inviteUser);

router.post('/user/getaccountsettings', Auth, getAccountSettings);
router.post('/user/updateaccountsettings', Auth, updateAccountSettings);


router.post('/admin/getusers', Auth, isAdmin,  getUsers );


module.exports = router;
