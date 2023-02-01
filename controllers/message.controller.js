const Message = require('../models/message.model');
const nodemailer = require('nodemailer');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.send = async (req, res) => {
  // check for all fields
  const { name, email, subject, message, target } = req.body;

  let msg = new Message({ name, email, subject, message, target });

  msg.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(result);
  });
};

exports.testEmail = async (req, res) => {
  const { transporterOptions, mailOptions } = req.body.detail;

  console.log(transporterOptions, mailOptions);

  const transporter = nodemailer.createTransport(transporterOptions);

  transporter.sendMail(mailOptions, function(error, info){
    res.send({ error, info });
  });
}