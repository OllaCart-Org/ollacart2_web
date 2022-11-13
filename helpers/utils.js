const nodemailer = require('nodemailer');
const Product = require('../models/product');
const User = require('../models/user');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@ollacart.com',
    pass: 'mhsaqafoiayfwplw'
  }
});

exports.checkCeID = async (user, ce_id) => {
  if (user && ce_id && user.ce_id !== ce_id) {
    user.ce_id = ce_id;
    await User.updateMany({ ce_id }, { $set: { ce_id: '' } });
    await user.save();
    await Product.updateMany({ ce_id, user: null }, { $set: { user: user._id } });
  }
}

exports.sendMail = async(mailTo, callback) => {
  var mailOptions = {
    from: 'support@ollacart.com',
    to: 'romanvaraksin763@gmail.com',
    subject: 'Welcome to Ollacart',
    text: 'Email test1'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      callback(error);
    } else {
      console.log('Email sent: ' + info.response);
      callback(info.response);
    }
  });
}