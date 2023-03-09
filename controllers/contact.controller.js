const Invest = require('../models/invest.model');
const Partner = require('../models/partner.model');
const Feedback = require('../models/feedback.model');

exports.sendInvestContact = async (req, res) => {
  const { name, email, company, comment } = req.body;

  let invest = new Invest({ name, email, company, comment });

  const result = await invest.save();
  if (!result) return res.status(400).json({ error: 'Failed sending request' });
  return res.send({});
};

exports.sendPartnerContact = async (req, res) => {
  const { name, email, company, comment } = req.body;

  let partner = new Partner({ name, email, company, comment });

  const result = await partner.save();
  if (!result) return res.status(400).json({ error: 'Failed sending request' });
  return res.send({});
};

exports.sendFeedbackContact = async (req, res) => {
  const { name, email, comment } = req.body;

  let feedback = new Feedback({ name, email, comment });

  const result = await feedback.save();
  if (!result) return res.status(400).json({ error: 'Failed sending request' });
  return res.send({});
};





exports.getFeedbacks = async (req, res) => {
  const { pagination } = req.body;

  const feedbacks = await Feedback.find()
    .sort([['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage).exec();
  
    const count = await Feedback.countDocuments({}) || 0;
  res.send({ success: true, feedbacks, total: count });
}

exports.getInvestorRequests = async (req, res) => {
  const { pagination } = req.body;

  const investors = await Invest.find()
    .sort([['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage).exec();
  
    const count = await Invest.countDocuments({}) || 0;
  res.send({ success: true, investors, total: count });
}

exports.getPartnerRequests = async (req, res) => {
  const { pagination } = req.body;

  const partners = await Partner.find()
    .sort([['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage).exec();
  
    const count = await Partner.countDocuments({}) || 0;
  res.send({ success: true, partners, total: count });
}