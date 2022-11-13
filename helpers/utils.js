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

exports.sendMail = async (mailTo) => {
  return new Promise(resolve => {
    var mailOptions = {
      from: 'support@ollacart.com',
      to: mailTo,
      subject: 'Welcome to Ollacart',
      html: `<h3>Welcome to Ollacart.</h3>
        <p>You can use ollacart chrome extension to add your own shopping items.</p>
        <p>Download chrome extension from&nbsp;<a href="http://www.ollacart.com">chrome web store</p>.</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      resolve({ error, info });
    });
  })
}