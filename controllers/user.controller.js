const User = require('../models/user.model');
const { errorHandler } = require('../helpers/dbErrorHandler');

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
  const { followId, email } = req.body;
  const followUser = await User.findOne({ _id: followId });
  if (!followUser) return res.status(400).json({ error: 'User not found' });

  let user = req.user;  
  if (!user) {
    if (!email) return res.status(400).json({ error: 'Email validation failed' });
    user = await User.findOne({ email });
    if (!user) {
      user = new User({ email })
      user.ce_id = '';
      const r = await user.save();
      if (!r) return res.status(400).json({ error: "Failed" });
    }
  }
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