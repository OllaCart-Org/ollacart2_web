const nodemailer = require('nodemailer');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Extension = require('../models/extension.model');
const Twilio = require('twilio');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@ollacart.com',
    pass: 'mhsaqafoiayfwplw'
  }
});

const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.takeFirstDecimal = (str) => {
  try {
    // return parseFloat(str.match(/[\d\.]+/)) || 0;
    return parseFloat((str + '').replace(/[^0-9.]+/g,"")) || 0;
  } catch (ex) {
    return 0;
  }
}

exports.checkCeID = async (user, ce_id) => {
  if (user && ce_id && user.ce_id !== ce_id) {
    user.ce_id = ce_id;
    await User.updateMany({ ce_id }, { $set: { ce_id: '' } });
    await user.save();
    await Product.updateMany({ ce_id, user: null }, { $set: { user: user._id } });
    await Extension.updateOne({ ce_id }, { ce_id, user: user._id }, { upsert: true });
  }
}

exports.sendWelcomeMail = async (mailTo) => {
  return new Promise(resolve => {
    var mailOptions = {
      from: 'support@ollacart.com',
      to: mailTo,
      subject: 'Welcome to OllaCart',
      html: `<p>Congrats on the first step towards your new online shopping experience. As we continue to develop the capabilities of OllaCart, download and use our <a href="https://chrome.google.com/webstore/detail/ollacart/hpbmlmabfkbhmhjhocddfckebbnbkcbm">Chrome Extension</a> to select items from any online shopping website and add them to your OllaCart. It is as easy as selecting the extension logo, selecting the item, and selecting the extension logo again.<br>
        When on <a href="https://www.ollacart.com">OllaCart.com</a>, select the items that you want to publish to your public online shopping cart. In order to share this list, select the share logo, and just copy and paste the website link at the top of your shared list, wherever you want.<br><br>
        In the future, you will be able to:<br>
        Purchase any item, from any website.<br>
        Browse suggested items.<br>
        Comment on and add from your friends’ items.<br>
        Browse, shop, and compare on OllaCart.<br><br>
        Security: Logging in to your account now only requires your email address in order to keep logging in hassle free. Our extension knows which cart to add your items to once you log in on the website. In case you would like to password protect your account, please let us know.<br><br>
        We appreciate you using OllaCart while we continue to build out the functionality and cannot wait to revolutionize online shopping; making it easier, more fun, and more convenient.<br><br>
        Have any suggestions? Let us know by responding to this email.</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      resolve({ error, info });
    });
  })
}

exports.sendRequestMail = async (mailTo) => {
  return new Promise(resolve => {
    var mailOptions = {
      from: 'support@ollacart.com',
      to: mailTo,
      subject: 'Persional Data request - Pending',
      html: `<p>We are processing your request for your user information collected by OllaCart. Please respond to support@ollacart.com with any questions.</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      resolve({ error, info });
    });
  })
}

exports.sendSecureMail = async (mailTo, uid, type) => {
  if (type === 'set') {
    const secure_link = `${process.env.DOMAIN}/secure/${uid}`;
    return new Promise(resolve => {
      var mailOptions = {
        from: 'support@ollacart.com',
        to: mailTo,
        subject: 'Secure your account',
        html: `<p>You can secure your account with email verification by clicking the button below to link your extension, email and OllaCart account.</p><a href="${secure_link}">Secure your account</a>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        resolve({ error, info });
      });
    })
  } else {
    const secure_link = `${process.env.DOMAIN}/verify/${uid}`;
    return new Promise(resolve => {
      var mailOptions = {
        from: 'support@ollacart.com',
        to: mailTo,
        subject: 'Signin to your Account',
        html: `<p>Your account is secured with email verification. Click the button below to signin to your OllaCart account.</p><a href="${secure_link}">Signin to your Account</a>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        resolve({ error, info });
      });
    })
  }
}

exports.sendPurchaseSMS = async (phoneTo, url) => {
  const res = await twilioClient.messages.create({
    body: 'Test SMS ' + url,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneTo
  });
  console.log('sendSMS', res);
}