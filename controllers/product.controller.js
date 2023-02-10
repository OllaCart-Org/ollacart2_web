const Product = require('../models/product.model');
const User = require('../models/user.model');
const Extension = require('../models/extension.model');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { takeFirstDecimal } = require('../helpers/utils');
const { URL } = require('url'); 

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
  let description = req.body.description || '',
    price = takeFirstDecimal(req.body.price || ''),
    photos = req.body.photos || [];
  let domain = new URL(url).origin || '';
  let user_id = null;
  // const user = req.profile._id;

  if (!name || !photo || !url || !ce_id) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  const extension = await Extension.findOne({ ce_id });
  if (extension) user_id = extension.user;

  let product = new Product({ name, photo, url, ce_id, description, price, photos, user: user_id, sequence: Date.now(), domain });

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

exports.update = (req, res) => {
  let product = req.product;
  if (!product) return res.status(400).json({ error: 'Product not found' });

  const detail = req.body;
  const keys = Object.keys(detail);
  for (let i = 0; i < keys.length; i ++) {
    const key = keys[i];
    product[key] = detail[key];
  }

  product.save((err, result) => {
    if (err) {
      console.log('PRODUCT UPDATE ERROR ', err);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(result);
  });
};

exports.updateLogo = async (req, res) => {
  let product = req.product;
  if (!product) return res.status(400).json({ error: 'Product not found' });

  const { logo } = req.body;
  const idx = product.photos.indexOf(logo);
  if (idx === -1) return res.status(400).json({ error: 'Photo not found' });

  product.photos[idx] = product.photo;
  product.photo = logo;

  const result = await product.save();
  res.json(result);
}

exports.updateSequence = async (req, res) => {
  const data = req.body.data;
  for (let i = 0; i < data.length; i ++) {
    const d = data[i];
    await Product.updateOne({ _id: d._id }, { sequence: d.sequence });
  }
  res.json({ success: true });
}

exports.remove = (req, res) => {
  let product = req.product;
  if (!product) return res.status(400).json({ error: 'Product not found' });
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
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  const { purchased, shared, _id } = req.body;

  const filters = {};
  let user = req.user;
  if (purchased) filters.purchased = 1;
  
  if (shared) {
    user = await User.findOne({ _id });
    if (!user) return res.status(400).json({ error: 'Not corret url' });
    filters.user = _id;
    filters.shared = 1;
  }
  else filters.user = req.user && req.user._id;

  Product.find(filters)
    .sort([['sequence', 'desc'], ['createdAt', 'desc']])
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






exports.getCarts = async (req, res) => {
  const { filter } = req.body;

  const carts = await Product.find()
    .sort([['sequence', 'desc'], ['createdAt', 'desc']])
    .skip((filter.page - 1) * filter.countPerPage)
    .limit(filter.countPerPage).populate('user').exec();
  res.send({ success: true, carts, total: await this.getProductCount() });
}






exports.updateDomain = async () => {
  const products = await Product.find();
  for (let i = 0; i < products.length; i ++) {
    const product = products[i];
    product.domain = new URL(product.url).origin || '';
    await product.save()
  }
}


exports.getProductCount = async (filter = {}) => {
  const count = await Product.countDocuments(filter) || 0;
  return count;
}

exports.getDomains = async () => {
  const products = await Product.aggregate([{ $group: { _id: '$domain', count: {$sum: 1} } }]);
  return products;
}

exports.getProductNames = async () => {
  const products = await Product.aggregate([{ $group: { _id: '$name', count: {$sum: 1} } }]);
  return products;
}


