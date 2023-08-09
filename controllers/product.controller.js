const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Extension = require('../models/extension.model');
const EmailController = require('./email.controller');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { takeFirstDecimal, getTaxRate } = require('../helpers/utils');
const { URL } = require('url'); 

exports.productById = async (req, res, next, id) => {
  let product = null;
  try {
    product = await Product.findById(id)
      .populate({
        path: 'user',
        select: '_id username email'
      })
      .exec();
  } catch (ex) {
  }
  
  if (!product) {
    product = await Product.findOne({ anonymousId: id });
    if (!product) return res.status(400).json({ error: 'Product not found' });
  }

  req.product = product;
  next();
};

exports.create = async (req, res) => {
  // check for all fields
  const { photo, url, original_url, color, size, name, ce_id } = req.body;
  let description = req.body.description || '',
    price = takeFirstDecimal(req.body.price || ''),
    photos = (req.body.photos || []).filter(photo => !!photo);
  let domain = new URL(original_url || url).origin || '';
  let user_id = null;
  // const user = req.profile._id;

  if (!name || !photo || !url || !ce_id) {
    return res.status(400).json({
      error: 'All fields are required',
    });
  }

  const extension = await Extension.findOne({ ce_id });
  if (extension) user_id = extension.user;

  let product = new Product({ name, photo, url, ce_id, description, price, color, size, original_url, photos, user: user_id, domain });

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

exports.update = async (req, res) => {
  const product = req.product;
  if (!product) return res.status(400).json({ error: 'Product not found' });

  const detail = req.body;
  
  const keys = ['name', 'size', 'description', 'url', 'price', 'keywords', 'purchased', 'shared', 'category', 'photo', 'photos']
  for (let i = 0; i < keys.length; i ++) {
    const key = keys[i];
    if (!Object.hasOwn(detail, key)) continue;

    if (key === 'price') {
      product[key] = parseFloat(detail[key]);
    } else if (key === 'purchased' || key === 'shared') {
      product[key] = parseInt(detail[key]);
    } else if (key === 'keywords') {
      if (!detail[key].length) continue;
      product[key] = detail[key];
    } else {
      product[key] = detail[key];
    }
  }

  const response = await product.save();
  if (!response) return res.status(400).json({ error: 'Update failed' });
  res.json(response);
};

exports.updateLogo = async (req, res) => {
  const product = req.product;
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

exports.forkProduct = async (req, res) => {
  const product = req.product;
  const user = req.user;
  if (!product) return res.status(400).json({ error: 'Product not found' });
  if (!user) return res.status(400).json({ error: 'Not signed in' });
  if (product.user._id.toString() === user._id.toString()) return res.status(400).json({ error: 'You can not add from your cart' });

  const p_from = await Product.findOne({ user: user._id, _id: {$in: product.forkedIds} });
  if (p_from) return res.status(400).json({ error: 'This is added from your Cart' });
  const p_already = await Product.findOne({ user: user._id, forkedIds: product._id });
  if (p_already) return res.status(400).json({ error: 'Already added' });

  const forkedIds = [ ...product.forkedIds, product._id ];
  const newProduct = new Product({
    ..._.pick(product, ['name', 'description', 'keywords', 'price', 'photo', 'photos', 'url', 'original_url', 'domain']),
    user: user._id,
    forkId: product._id,
    forkedIds
  })
  const response = await newProduct.save();
  if (!response) return res.status(400).json({ error: 'Add failed' });
  res.json(response);
}

exports.adminAddProduct = async (req, res) => {
  const product = req.product;
  const user = await User.findOne({ _id: req.body.userID });
  if (!product) return res.status(400).json({ error: 'Product not found' });
  if (!user) return res.status(400).json({ error: 'Not signed in' });
  if (product.user._id.toString() === user._id.toString()) return res.status(400).json({ error: 'You can not add to your cart' });
  
  const p_from = await Product.findOne({ user: user._id, _id: {$in: product.forkedIds} });
  if (p_from) return res.status(400).json({ error: `This is added from user's Cart` });
  const p_already = await Product.findOne({ user: user._id, forkedIds: product._id });
  if (p_already) return res.status(400).json({ error: 'Already added' });
  
  const forkedIds = [ ...product.forkedIds, product._id ];
  const newProduct = new Product({
    ..._.pick(product, ['name', 'description', 'keywords', 'price', 'photo', 'photos', 'url', 'original_url', 'domain']),
    user: user._id,
    forkId: product._id,
    forkedIds,
    addedBy: req.user._id
  })
  const response = await newProduct.save();
  if (!response) return res.status(400).json({ error: 'Add failed' });
  res.json(response);
}

exports.thumbup = async (req, res) => {
  const product = req.product;
  const user = req.user;
  if (!product) return res.status(400).json({ error: 'Product not found' });
  if (!user) return res.status(400).json({ error: 'Not signed in' });

  const { likes, dislikes } = product;
  if (likes.includes(user._id)) {
    likes.splice(likes.indexOf(user), 1);
  } else {
    likes.push(user._id);
    const idx = dislikes.indexOf(user._id);
    if (idx > -1) dislikes.splice(idx, 1);

    setTimeout(async () => {
      const _p = await Product.findOne({ _id: product._id });
      if (!_p) return;
      if (_p.likes.includes(user._id)) {
        const forkedProducts = await Product.find({_id: {$in: _p.forkedIds}});
        for (let i = 0; i < forkedProducts.length; i ++) {
          const { likes, dislikes } = forkedProducts[i];
          if(likes.includes(user._id) || dislikes.includes(user._id)) continue;
          likes.push(user._id);
          await forkedProducts[i].save();
        }
      }
    }, 20000);
  }

  await product.save();
  res.send({ product });
}

exports.thumbdown = async (req, res) => {
  const product = req.product;
  const user = req.user;
  if (!product) return res.status(400).json({ error: 'Product not found' });
  if (!user) return res.status(400).json({ error: 'Not signed in' });

  const { likes, dislikes } = product;
  if (dislikes.includes(user._id)) {
    dislikes.splice(dislikes.indexOf(user), 1);
  } else {
    dislikes.push(user._id);  
    const idx = likes.indexOf(user._id);
    if (idx > -1) likes.splice(idx, 1);
  }
  
  await product.save();
  res.send({ product });
}

exports.singleShare = async (req, res) => {
  const product = req.product;
  const email = req.body.email;
  if (!product) return res.status(400).json({ error: 'Product not found' });
  if (!email) return res.status(400).json({ error: 'Invalid email' });

  EmailController.sendSingleShareEmail(product, email);
  res.send({});
}

exports.anonymousShare = async (req, res) => {
  const user = req.user;
  const product = req.product;
  const email = req.body.email;
  if (!user) return res.status(400).json({ error: 'Not signed in' });
  if (!user?.status?.anonymous_username) return res.status(400).json({ error: 'Toggle this feature on from account settings first' });
  if (!product) return res.status(400).json({ error: 'Product not found' });
  if (!email) return res.status(400).json({ error: 'Invalid email' });

  if (!product.anonymousId) {
    product.anonymousId = uuidv4();
    await product.save();
  }

  EmailController.sendAnonymousShareEmail(product, email);
  res.send({});
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

exports.getProduct = async (req, res) => {
  let product = req.product;
  if (!product) return res.status(400).json({ error: 'Product not found' });
  res.send({ product });
}

exports.listBySearch = async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  const { purchased, shared, social, _id } = req.body;

  const filters = {};
  let user = req.user;
  if (purchased) filters.purchased = 1;

  if (shared) {
    filters.user = _id;
    filters.shared = 1;
  }
  else if (social) {
    filters.user = { $in: req.body._ids || [] };
    filters.shared = 1;
  }
  else filters.user = req.user && req.user._id;

  Product.find(filters)
    .sort([['sequence', 'desc'], ['createdAt', 'desc']])
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'user',
      select: '_id username email'
    })
    .exec(async (err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      if(user && user.status?.tax) {
        for (const p of data) {
          const taxRate = await getTaxRate(user.shipping, p.category);
          if (taxRate >= 0) {
            p.taxPrice = p.price * taxRate;
            p.price = Math.ceil((p.price + p.taxPrice) * 100) / 100;
          }
        }
      }
      res.json({
        size: data.length,
        data
      });
    });
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
exports.getShareStatus = async (req, res) => {
  const { _id } = req.body;
  const shareUser = await User.findOne({ _id });
  if (!shareUser) return res.status(400).json({ error: 'Share cart not found' });

  const followedCount = await User.countDocuments({ following: { $in: [ _id ] } });

  let followStatus = false, username = shareUser.username || shareUser.email.split('@')[0];

  const user = req.user;
  if (user) {
    const idx = user.following.indexOf(_id);
    followStatus = idx > -1;
  }
  res.send({ followStatus, followedCount, username })
}

exports.getSocialStatus = async (req, res) => {
  const user = req.user;
  const users = await User.find({ _id: { $ne: user?._id } } ).select('username email').exec();
  const following = user?.following || [];
  res.send({ following, users });
}






exports.getCarts = async (req, res) => {
  const { pagination } = req.body;
  const filter = req.body.filter || {};

  const carts = await Product.find(filter)
    .sort([['sequence', 'desc'], ['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage).populate('user').exec();
  res.send({ success: true, carts, total: await this.getProductCount(filter) });
}






exports.updateDomain = async () => {
  const products = await Product.find();
  for (let i = 0; i < products.length; i ++) {
    const product = products[i];
    product.domain = new URL(product.original_url || product.url).origin || '';
    await product.save()
  }
}


exports.getProductCount = async (filter = {}) => {
  const count = await Product.countDocuments(filter) || 0;
  return count;
}

exports.getDomains = async () => {
  const products = await Product.aggregate([{ $group: { _id: '$domain', count: {$sum: 1}, createdAt: {$max: "$createdAt"}}}]);
  return products;
}

exports.getProductNames = async () => {
  const products = await Product.aggregate([{ $group: { _id: '$name', count: {$sum: 1}, createdAt: {$max: "$createdAt"}}}]);
  return products;
}


