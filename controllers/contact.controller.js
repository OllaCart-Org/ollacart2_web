const User = require('../models/user.model');
const Invest = require('../models/invest.model');
const Partner = require('../models/partner.model');

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
  if (!email) return res.status(400).json({ error: 'Email validation failed' });

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email })
    const r = await user.save();
    if (!r) return res.status(400).json({ error: "Failed" });
  }

  user.feedbackName = name;
  user.feedback = comment;

  const result = await user.save();
  if (!result) return res.status(400).json({ error: 'Failed sending request' });
  return res.send({});
};
