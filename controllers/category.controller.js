const Category = require('../models/category.model');


exports.categoryById = (req, res, next, id) => {
  Category.findById(id)
    .populate({
      path: 'user',
      select: '_id username email'
    })
    .exec((err, category) => {
      if (err || !category) {
        return res.status(400).json({ error: 'Category not found' });
      }
      req.category = category;
      next();
    });
};

exports.create = async (req, res) => {
  const user = req.user;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Invalid name' });
  const _old = await Category.findOne({ name });
  if (_old) return res.status(400).json({ error: 'Already exists' });
  
  const category = new Category({ name, user });
  await category.save();
  res.json({ category });
}

exports.update = async (req, res) => {
  const category = req.category;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Invalid name' });
  const _old = await Category.findOne({ name, _id: {$ne: category._id} });
  if (_old) return res.status(400).json({ error: 'Already exists' });

  category.name = name;
  await category.save();
  res.json({ category });
}

exports.remove = async (req, res) => {
  const category = req.category;
  await category.remove();
  res.json({ success: true });
}






exports.getCategoryCount = async (filter = {}) => {
  const count = await Category.countDocuments(filter) || 0;
  return count;
}


exports.getCategories = async (req, res) => {
  const { pagination } = req.body;

  const categories = await Category.find()
    .sort([['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage).populate('user').exec();
  res.send({ success: true, categories, total: await this.getCategoryCount() });
}