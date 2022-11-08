const express = require('express');
const router = express.Router();

const {
  signup,
  signin,
  signout,
  verifyUser,
} = require('../controllers/auth');
const { userSignupValidator } = require('../validator');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSignupValidator, signin);
router.post('/Verify', verifyUser);
router.get('/signout', signout);

module.exports = router;
