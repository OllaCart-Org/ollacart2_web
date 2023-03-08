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
