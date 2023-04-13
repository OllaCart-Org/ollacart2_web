const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');
const path = require('path');
const utils = require('../helpers/utils');

nunjucks.configure(path.join(__dirname, "../templates"), { autoescape: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@ollacart.com',
    pass: 'mhsaqafoiayfwplw'
  }
});

const readTemplate = (type, params) => {
  const content = nunjucks.render(`${type}.template.html`, {
    ...params,
    siteUrl: process.env.DOMAIN,
    extensionUrl: process.env.EXTENSION_URL,
  });
  return content;
}

exports.sendWelcomeEmail = (mailTo) => {
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject: 'Welcome to OllaCart',
    html: readTemplate('welcome', { })
  };
  
  transporter.sendMail(mailOptions);
}

exports.sendSecureEmail = (mailTo, user, secureId) => {
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject: 'Secure Account',
    html: readTemplate('secure', {
      user: utils.getUsername(user),
      secureUrl: `${process.env.DOMAIN}/secure/${secureId}`
    })
  };
  
  transporter.sendMail(mailOptions);
}

exports.sendVerifyEmail = (mailTo, user, verifyId) => {
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject: 'Signin to your Account',
    html: readTemplate('verify', {
      user: utils.getUsername(user),
      verifyUrl: `${process.env.DOMAIN}/verify/${verifyId}`
    })
  };
  
  transporter.sendMail(mailOptions);
}

exports.sendInviteEmail = (mailTo, fromUser, verifyId) => {
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject: 'Invitation to OllaCart',
    html: readTemplate('invite', {
      user: utils.getUsername(fromUser),
      inviteUrl: `${process.env.DOMAIN}/verify/${verifyId}?redirect=social`
    })
  };
  
  transporter.sendMail(mailOptions);
}

exports.sendSingleShareEmail = (product, mailTo) => {
  let subject = 'Direct Share';
  if(product?.user) subject += ' from @' + utils.getUsername(product?.user);
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject,
    html: readTemplate('singleshare', {
      name: product.name,
      price: product.price,
      description: product.description,
      photo: product.photo,
      link: `${process.env.DOMAIN}/share/together/${product._id}`,
    })
  };
  
  transporter.sendMail(mailOptions);
}

exports.sendAnonymousShareEmail = (product, mailTo) => {
  let subject = 'Anonymous Share';
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject,
    html: readTemplate('singleshare', {
      name: product.name,
      price: product.price,
      description: product.description,
      photo: product.photo,
      link: `${process.env.DOMAIN}/share/together/${product.anonymousId}`,
    })
  };
  
  transporter.sendMail(mailOptions);
}