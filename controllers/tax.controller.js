const Tax = require('../models/tax.model');
const Category = require('../models/category.model');

exports.update = async (req, res) => {
  let { category, taxJson } = req.body;
  if (!category || category === -1) category = null;

  await Tax.updateOne({ category }, { $set: { taxJson, user: req.user } }, { upsert: true });
  res.json({ success: true });
}

exports.getTaxes = async (req, res) => {
  let { category } = req.body;
  if(!category || category === -1) category = null;
  
  const tax = await Tax.findOne({ category })
    .populate({
      path: 'user',
      select: '_id username email'
    })
    .exec();
  res.send({ tax });
}