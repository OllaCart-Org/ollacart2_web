const nodemailer = require("nodemailer");
const nunjucks = require("nunjucks");
const path = require("path");
const utils = require("../helpers/utils");

nunjucks.configure(path.join(__dirname, "../templates"), { autoescape: true });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "support@ollacart.com",
    pass: "mhsaqafoiayfwplw",
  },
});

const readTemplate = (type, params) => {
  const content = nunjucks.render(`${type}.template.html`, {
    ...params,
    siteUrl: process.env.DOMAIN,
    extensionUrl: process.env.EXTENSION_URL,
  });
  return content;
};

exports.sendWelcomeEmail = (mailTo) => {
  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject: "Welcome to OllaCart",
    html: readTemplate("welcome", {}),
  };

  transporter.sendMail(mailOptions);
};

exports.sendSecureEmail = (mailTo, user, secureId) => {
  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject: "Secure Account",
    html: readTemplate("secure", {
      user: utils.getUsername(user),
      secureUrl: `${process.env.DOMAIN}/secure/${secureId}`,
    }),
  };

  transporter.sendMail(mailOptions);
};

exports.sendVerifyEmail = (mailTo, user, verifyId) => {
  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject: "Signin to your Account",
    html: readTemplate("verify", {
      user: utils.getUsername(user),
      verifyUrl: `${process.env.DOMAIN}/verify/${verifyId}`,
    }),
  };

  transporter.sendMail(mailOptions);
};

exports.sendInviteEmail = (mailTo, fromUser, verifyId) => {
  const username = utils.getUsername(fromUser);
  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject: `Invitation to OllaCart from ${username}`,
    html: readTemplate("invite", {
      user: username,
      inviteUrl: `${process.env.DOMAIN}/verify/${verifyId}?redirect=social`,
    }),
  };

  transporter.sendMail(mailOptions);
};

exports.sendSingleShareEmail = (product, mailTo) => {
  let subject = "Direct Share";
  if (product?.user) subject += " from @" + utils.getUsername(product?.user);
  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject,
    html: readTemplate("singleshare", {
      name: product.name,
      price: product.price,
      description: product.description,
      photo: product.photo.normal || product.photo.url,
      link: `${process.env.DOMAIN}/share/together/${product._id}`,
    }),
  };

  transporter.sendMail(mailOptions);
};

exports.sendAnonymousShareEmail = (product, mailTo) => {
  let subject = "Anonymous Share";
  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject,
    html: readTemplate("singleshare", {
      name: product.name,
      price: product.price,
      description: product.description,
      photo: product.photo.normal || product.photo.url,
      link: `${process.env.DOMAIN}/share/together/${product.anonymousId}`,
    }),
  };

  transporter.sendMail(mailOptions);
};

exports.sendOrderStatusChangedEmail = (product, mailTo) => {
  if (!product.orderStatus) return;

  const subjects = [
    "",
    "Your Order Has Been Placed",
    "Your Order Has Been Shipped",
    "Your Order Has Been Closed",
  ];
  const templates = ["", "order-placed", "order-shipped", "order-closed"];
  const subject = subjects[product.orderStatus];
  const template = templates[product.orderStatus];

  const params = {
    name: product.name,
    price: product.price,
    description: product.description,
    photo: product.photo.normal || product.photo.url,
  };

  if (product.orderStatus === 1) {
    params.promocontent = "";
    if (product.promoCode)
      params.promocontent = `Promo Code: ${product.promoCode}`;
  }
  if (product.orderStatus === 2) {
    params.shippingcontent = "";
    if (product.shippingNote)
      params.shippingcontent = `Shipping Note: ${product.shippingNote}`;
  }

  var mailOptions = {
    from: "support@ollacart.com",
    to: mailTo,
    subject,
    html: readTemplate(template, params),
  };

  transporter.sendMail(mailOptions);
};
