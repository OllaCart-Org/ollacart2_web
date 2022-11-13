const nodemailer = require('nodemailer');
const Product = require('../models/product');
const User = require('../models/user');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'romanvaraksin763@gmail.com',
    pass: 'Z@xar2013'
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

exports.sendMail = async(mailTo) => {
  var mailOptions = {
    from: 'romanvaraksin763@gmail.com',
    to: 'kachurihor111@gmail.com',
    subject: 'Welcome to Ollacart',
    text: 'Email test1'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}