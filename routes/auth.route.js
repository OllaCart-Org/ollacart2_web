const express = require('express');
const router = express.Router();

const {
  Auth,
  signin,
  signout,
  request,
  verifyUser,
  verifySecure,
  verifySignin,
  checkSecureVerified
} = require('../controllers/auth.controller');
const { userSignupValidator } = require('../validator');

router.post('/signin', userSignupValidator, signin);
router.post('/request', userSignupValidator, request);
router.post('/Verify', verifyUser);
router.get('/signout', signout);

router.post('/auth/verifysecure', Auth, verifySecure);
router.post('/auth/verifysignin', Auth, verifySignin);

router.post('/auth/checkSecureVerified', Auth, checkSecureVerified);

module.exports = router;
