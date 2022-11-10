const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');
const User = require('../models/user');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'Product not found',
        });
      }
      req.product = product;
      next();
    });
};

exports.create = async (req, res) => {
  // check for all fields
  const { photo, url, name, ce_id } = req.body;
  let user_id = null;
  // const user = req.profile._id;

  if (!name || !photo || !url || !ce_id) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  const user = await User.findOne({ ce_id });
  if (user) user_id = user.id;

  let product = new Product({ name, photo, url, ce_id, user: user_id });

  product.save((err, result) => {
    if (err) {
      console.log('PRODUCT CREATE ERROR ', err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(result);
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: 'Product deleted successfully',
    });
  });
};

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : 'createdAt';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  const { share, _id } = req.body;

  const filters = {};
  let user = req.user;
  if (share) {
    user = await User.findOne({ _id });
    if (!user) return res.status(400).json({ error: 'Not corret url' });
    filters.user = _id;
    filters.shared = 1;
  }
  else filters.user = req.user && req.user._id;

  Product.find(filters)
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json({
        size: data.length,
        data,
        email: user?.email
      });
    });
};

exports.share = (req, res, next) => {
  let share = req.body.share;
  req.product.shared = share;
  req.product.save((err, result) => {
    if (err) {
      console.log('PRODUCT SHARE ERROR ', err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(result);
  });
};
