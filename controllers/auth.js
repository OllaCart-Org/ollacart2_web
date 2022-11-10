const User = require('../models/user');
const Utils = require('../helpers/utils');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for auth check
const { errorHandler } = require('../helpers/dbErrorHandler');

require('dotenv').config();

exports.signup = (req, res) => {
  // console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    res.json({
      user,
    });
  });
};

exports.signin = async (req, res) => {
  // find the user based on email
  const { email, ce_id } = req.body;
  User.findOne({ email }, async (err, user) => {
    if (err || !user) {
      user = new User(req.body)
      user.ce_id = '';
      const r = await user.save();
      if (!r)
        return res.status(400).json({ error: "Error occured!" });
    }

    await Utils.checkCeID(user, ce_id);
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('t', token, { expire: new Date() + 9999 });
    
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.verifyUser = (req, res) => {
  // find the user based on email
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded._id) return res.status(400).json({ error: "Error occured!" });
  User.findOne({ _id: decoded._id }, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Error occured!" });
    }
    
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.Auth = async (req, res, next) => {
  const { token, ce_id } = req.body;
  if (!token) return next();
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded._id) next();
  
  const user = await User.findOne({ _id: decoded._id });
  await Utils.checkCeID(user, ce_id);
  req.user = user;
  next();
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  // algorithms: ['RS256'],
  userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied',
    });
  }
  next();
};
