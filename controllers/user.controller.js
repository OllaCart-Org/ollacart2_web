const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');
const utils = require('../helpers/utils');

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  // console.log('user update', req.body);
  // req.body.role = 0; // role will always be 0
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to perform this action',
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};


exports.getFollowingStatus = async (req, res) => {
  const { followId } = req.body;
  const followUser = await User.findOne({ _id: followId });
  if (!followUser) return res.status(400).json({ error: 'User not found' });

  const followedCount = await User.countDocuments({ following: { $in: [ followId ] } });

  const user = req.user;
  if (!user) return res.send({ status: false, count: followedCount });
  const idx = user.following.indexOf(followId);
  res.send({ status: idx > -1, count: followedCount })
}

exports.followUser = async (req, res) => {
  const { followId } = req.body;
  const followUser = await User.findOne({ _id: followId });
  if (!followUser) return res.status(400).json({ error: 'User not found' });

  let user = req.user;  
  if (!user) return res.status(400).json({ error: 'Email validation failed' });
  if (user._id.toString() === followUser._id.toString()) return res.status(400).json({ error: 'You can not follow your cart' });
  
  const following = user.following;
  const idx = following.indexOf(followId);
  if (idx > -1) return res.status(400).json({ error: 'Already followed' });
  following.push(followId);
  await user.save();
  res.send({ });
}

exports.unFollowUser = async (req, res) => {
  const { followId } = req.body;
  const followUser = await User.findOne({ _id: followId });
  if (!followUser) return res.status(400).json({ error: 'User not found' });

  const user = req.user;
  if (user) {
    const following = user.following;
    const idx = following.indexOf(followId);
    if (idx === -1) return res.status(400).json({ error: 'Not followed user' });
    following.splice(idx, 1);
    await user.save();
    return res.send({ });
  }
  res.status(400).json({ error: 'Not success' });
}

exports.getAccountSettings = async (req, res) => {
  if (!req.user) return res.status(400).json({ error: 'Not signed in' });
  res.json({ user: req.user });
}

exports.updateAccountSettings = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ error: 'Not signed in' });

  if (typeof req.body.name === 'string') {
    user.name = req.body.name || '';
  }
  if (typeof req.body.phone === 'string') {
    user.phone = req.body.phone || '';
  }
  if (req.body.shipping) {
    const { line1, line2, postal_code, country, city, state } = req.body.shipping;
  
    user.shipping.line1 = line1 || '';
    user.shipping.line2 = line2 || '';
    user.shipping.postal_code = postal_code || '';
    user.shipping.country = country || '';
    user.shipping.city = city || '';
    user.shipping.state = state || '';
  }
  if (req.body.status) {
    const { secure, shopping_recommendation, tax, promo_code, anonymous_shopping } = req.body.status;
    if (typeof secure === 'boolean') {
      if (secure) {
        if (user.status.secure) return res.status(400).json({ error: 'Already secured' });
        user.secure_identity = uuidv4();
        await utils.sendSecureMail(user.email, user.secure_identity, 'set');
      } else {
        user.secure_identity = false;
        user.status.secure = false;
      }
    }
    if (typeof shopping_recommendation === 'boolean') {
      user.status.shopping_recommendation = shopping_recommendation;
    }
    if (typeof tax === 'boolean') {
      user.status.tax = tax;
    }
    if (typeof promo_code === 'boolean') {
      user.status.promo_code = promo_code;
    }
    if (typeof anonymous_shopping === 'boolean') {
      user.status.anonymous_shopping = anonymous_shopping;
    }
  }

  const response = await user.save();
  if (!response) return res.status(400).json({ error: 'Saving failed!' });
  res.json({ });
}








exports.getUsers = async (req, res) => {
  const { pagination } = req.body;

  const users = await User.find()
    .sort([['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage).populate('user').exec();
  res.send({ success: true, users, total: await this.getUserCount() });
}

exports.getUserCount = async (filter = {}) => {
  const count = await User.countDocuments(filter) || 0;
  return count;
}