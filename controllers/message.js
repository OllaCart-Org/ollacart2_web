const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Message = require('../models/message');
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