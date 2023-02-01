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

exports.getUsers = async (req, res) => {
  const { filter } = req.body;

  const users = await User.find()
    .sort([['createdAt', 'desc']])
    .skip((filter.page - 1) * filter.countPerPage)
    .limit(filter.countPerPage).populate('user').exec();
  res.send({ success: true, users, total: await this.getUserCount() });
}

exports.getUserCount = async (filter = {}) => {
  const count = await User.countDocuments(filter) || 0;
  return count;
}