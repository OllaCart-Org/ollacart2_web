const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const Request = require('../models/request.model');
const Utils = require('../helpers/utils');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJwt = require('express-jwt'); // for auth check
const { errorHandler } = require('../helpers/dbErrorHandler');
const utils = require('../helpers/utils');

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
  const email = req.body.email,
    ce_id = req.body.ce_id;
  
  User.findOne({ email }, async (err, user) => {
    if (err || !user) {
      const response = await utils.sendWelcomeMail(req.body.email);
      if (response.error) return res.status(400).json({ error: "Wrong email!" });

      user = new User({ email })
      user.ce_id = '';
      const r = await user.save();
      if (!r) return res.status(400).json({ error: "Error occured!" });
    }

    if (user.status.secure) {
      user.secure_identity = uuidv4();
      await user.save();
      await utils.sendSecureMail(user.email, user.secure_identity);
      return res.json({ verify: true, uid: user.secure_identity });
    }

    await Utils.checkCeID(user, ce_id);
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('t', token, { expire: new Date() + 9999 });
    
    const { _id, name, role, email } = user;
    return res.json({ token, user: { _id, email, role, name } });
  });
};

exports.request = async (req, res) => {
  const email = req.body.email;
  const response = await utils.sendRequestMail(email);
  if (response.error) return res.status(400).json({ error: "Wrong email!" });
  let request = new Request(req.body);
  await request.save();
  res.json({ email })
}

exports.verifyUser = (req, res) => {
  // find the user based on email
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded._id) return res.status(400).json({ error: "Error occured!" });
  User.findOne({ _id: decoded._id }, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Error occured!" });
    }
    
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success' });
};




exports.verifySecure = async (req, res) => {
  try {
    const {uid} = req.body;
    user = await User.findOne({ secure_identity: uid });
    if (!user) return res.status(400).json({ error: 'Invalid verification code' });
    user.status.secure = true;
    user.last_verified = uid;
    await user.save();
    res.json({ success: true });
  } catch(ex) {
    console.log(ex);
    res.status(400).json({ error: 'Error!' });
  }
}

exports.verifySignin = async (req, res) => {
  try {
    const {uid} = req.body;
    user = await User.findOne({ secure_identity: uid });
    if (!user) return res.status(400).json({ error: 'Invalid verification code' });
    
    user.last_verified = uid;
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('t', token, { expire: new Date() + 9999 });
    res.json({ token });
  } catch(ex) {
    console.log(ex);
    return res.status(400).json({ error: 'Error!' });
  }
}

exports.checkSecureVerified = async (req, res) => {
  const {uid} = req.body;
  try {
    const user = await User.findOne({ last_verified: uid });
    if(user) return res.send({ success: true });
  } catch(ex) {
    console.log(ex);
  }
  res.send({success: false});
}




exports.Auth = async (req, res, next) => {
  const { token, ce_id } = req.body;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) next();
    
    const user = await User.findOne({ _id: decoded._id });
    await Utils.checkCeID(user, ce_id);
    req.user = user;
  } catch {
    req.user = null;
  }
  next();
};

exports.AuthWithEmail = async (req, res, next) => {
  const { email } = req.body;
  if(req.user) return next();
  if(!email) return next();
  
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email })
    user.ce_id = '';
    const r = await user.save();
    if (!r) return next();
  }

  req.user = user;
  next();
}

exports.isAuth = (req, res, next) => {
  let user = req.user;
  if (!user) {
    return res.status(403).json({
      error: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin Access denied',
    });
  }
  next();
};

