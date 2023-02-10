const express = require('express');
const router = express.Router();

const {
  Auth,
  signup,
  signin,
  signout,
  request,
  verifyUser,
  setSecure,
  verifySecure,
  verifySignin,
  checkSecureVerified
} = require('../controllers/auth.controller');
const { userSignupValidator } = require('../validator');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSignupValidator, signin);
router.post('/request', userSignupValidator, request);
router.post('/Verify', verifyUser);
router.get('/signout', signout);

router.post('/auth/setsecure', Auth, setSecure);
router.post('/auth/verifysecure', Auth, verifySecure);
router.post('/auth/verifysignin', Auth, verifySignin);

router.post('/auth/checkSecureVerified', Auth, checkSecureVerified);

module.exports = router;
