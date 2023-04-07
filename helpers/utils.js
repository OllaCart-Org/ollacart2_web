const nodemailer = require('nodemailer');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Extension = require('../models/extension.model');
const SalesTax = require('sales-tax');
const Twilio = require('twilio');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@ollacart.com',
    pass: 'mhsaqafoiayfwplw'
  }
});

const twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.getUsername = (user) => {
  if (!user) return '';
  return user.username || (user.email || '').split('@')[0];
}

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

exports.sendSecureMail = async (mailTo, uid) => {
  const secure_link = `${process.env.DOMAIN}/verify/${uid}`;
  return new Promise(resolve => {
    var mailOptions = {
      from: 'support@ollacart.com',
      to: mailTo,
      subject: 'Signin to your Account',
      html: `<p>You are invited to OllaCart. Click the button below to accept invitattion to OllaCart.</p><a href="${secure_link}">Accept</a>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      resolve({ error, info });
    });
  })
}

exports.sendOrderStatusMail = async (mailTo, product) => {
  const message = ['The product order status changed to UnOrdered', 'The product order is placed.', 'The product is in shipping.', 'The product order is closed.'];
  const subject = 'OllaCart Order';
  let html = `<h4>"${product.name + ' $' + product.price}"</h4><p>${message[product.orderStatus]}</p>`;
  if (product.orderStatus === 1 && product.promoCode) html += `<p>Promo Code: ${product.promoCode}</p>`;
  if (product.orderStatus === 2 && product.shippingNote) html += `<p>Shipping Note: ${product.shippingNote}</p>`;

  return new Promise(resolve => {
    var mailOptions = {
      from: 'support@ollacart.com',
      to: mailTo,
      subject,
      html
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      resolve({ error, info });
    });
  })
}

exports.sendNewOrderMail = async (order) => {
  return new Promise(resolve => {
    var mailOptions = {
      from: 'support@ollacart.com',
      to: 'support@ollacart.com',
      subject: 'New order arrived',
      html: `<p>New order($${order.totalReceived}) arrived from ${order.user.email}</p>`
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      resolve({ error, info });
    });
  })
}

exports.sendPurchaseSMS = async (phoneTo, url) => {
  const res = await twilioClient.messages.create({
    body: 'Test SMS ' + url,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneTo
  });
  console.log('sendSMS', res);
}

exports.getTaxRate = async (shipping, product) => {
  const {country, state} = shipping;
  if (SalesTax.hasStateSalesTax(country, state)) {
    const res = await SalesTax.getSalesTax(country, state);
    return res.rate || 0;
  }
  if (SalesTax.hasSalesTax(country)) {
    const res = await SalesTax.getSalesTax(country);
    return res.rate || 0;
  }
  return 0;
}