const Tax = require('../models/tax.model');
const Category = require('../models/category.model');

exports.update = async (req, res) => {
  const { category, taxJson } = req.body;
  if(!category) return res.status(400).send({ error: 'No Category' });

  await Tax.updateOne({ category }, { $set: { taxJson, user: req.user } }, { upsert: true });
  res.json({ success: true });
}

exports.getTaxes = async (req, res) => {
  const { category } = req.body;
  
  const tax = await Tax.findOne({ category })
    .populate({
      path: 'user',
      select: '_id username email'
    })
    .exec();
  res.send({ tax });
}