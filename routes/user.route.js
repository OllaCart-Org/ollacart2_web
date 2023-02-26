const express = require('express');
const router = express.Router();

const { Auth, isAdmin } = require('../controllers/auth.controller');

const { getUsers, followUser, unFollowUser, getFollowingStatus } = require('../controllers/user.controller');

router.post('/user/follow/status', Auth, getFollowingStatus);
router.post('/user/follow', Auth, followUser);
router.post('/user/unfollow', Auth, unFollowUser);


router.post('/admin/getusers', Auth, isAdmin,  getUsers );


module.exports = router;
