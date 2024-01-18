const nodemailer = require("nodemailer");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Extension = require("../models/extension.model");
const Tax = require("../models/tax.model");
const SalesTax = require("sales-tax");
const Twilio = require("twilio");
const apn = require("apn");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "support@ollacart.com",
    pass: "mhsaqafoiayfwplw",
  },
});

const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const apnOptions = {
  token: {
    key: "key/iOS.p8",
    keyId: "G4FPSL6542",
    teamId: "L89WH4ZSXY",
  },
  production: false,
};
const apnProvider = new apn.Provider(apnOptions);

exports.getUsername = (user) => {
  if (!user) return "";
  return user.username || (user.email || "").split("@")[0];
};

exports.takeFirstDecimal = (str) => {
  try {
    // return parseFloat(str.match(/[\d\.]+/)) || 0;
    return parseFloat((str + "").replace(/[^0-9.]+/g, "")) || 0;
  } catch (ex) {
    return 0;
  }
};

exports.checkCeID = async (user, ce_id) => {
  if (user && ce_id && user.ce_id !== ce_id) {
    user.ce_id = ce_id;
    await User.updateMany({ ce_id }, { $set: { ce_id: "" } });
    await user.save();
    await Product.updateMany(
      { ce_id, user: null },
      { $set: { user: user._id } }
    );
    await Extension.updateOne(
      { ce_id },
      { ce_id, user: user._id },
      { upsert: true }
    );
  }
};

exports.sendRequestMail = async (mailTo) => {
  return new Promise((resolve) => {
    var mailOptions = {
      from: "support@ollacart.com",
      to: mailTo,
      subject: "Persional Data request - Pending",
      html: `<p>We are processing your request for your user information collected by OllaCart. Please respond to support@ollacart.com with any questions.</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      resolve({ error, info });
    });
  });
};

exports.sendSecureMail = async (mailTo, uid) => {
  const secure_link = `${process.env.DOMAIN}/verify/${uid}`;
  return new Promise((resolve) => {
    var mailOptions = {
      from: "support@ollacart.com",
      to: mailTo,
      subject: "Signin to your Account",
      html: `<p>You are invited to OllaCart. Click the button below to accept invitattion to OllaCart.</p><a href="${secure_link}">Accept</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      resolve({ error, info });
    });
  });
};

exports.sendNewOrderMail = async (order) => {
  return new Promise((resolve) => {
    var mailOptions = {
      from: "support@ollacart.com",
      to: "support@ollacart.com",
      subject: "New order arrived",
      html: `<p>New order($${order.totalReceived}) arrived from ${order.user.email}</p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      resolve({ error, info });
    });
  });
};

exports.sendPurchaseSMS = async (phoneTo, url) => {
  const res = await twilioClient.messages.create({
    body: "Test SMS " + url,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneTo,
  });
  console.log("sendSMS", res);
};

const getValidTaxRate = (data) => {
  if (!data && data !== 0) return null;
  if (typeof data !== "object") {
    if (typeof data === "number") return data;
    return parseFloat(data) || null;
  }
  const rate = data["taxRate"];
  if (!rate && rate !== 0) return null;
  if (typeof rate === "number") return rate;
  return parseFloat(rate) || null;
};

const getTaxRateFromJson = (json, country, state, zipcode) => {
  if (!json || typeof json !== "object") return null;
  if (!json[country] && json[country] !== 0) return null;
  const cJson = json[country];

  let taxRate = null;
  const cTaxRate = getValidTaxRate(cJson);

  if (!state) {
    if (zipcode) {
      taxRate = getValidTaxRate(cJson[zipcode]);
    }
  } else {
    const sJson = cJson[state];
    if (!sJson && sJson !== 0);
    else {
      const sTaxRate = getValidTaxRate(sJson);
      if (zipcode) taxRate = getValidTaxRate(sJson[zipcode]);
      if (taxRate === null) taxRate = sTaxRate;
    }
  }
  if (taxRate === null) taxRate = cTaxRate;
  if (taxRate === null) return null;
  return taxRate / 100;
};

exports.getTaxRate = async (shipping, category) => {
  if (!shipping) return -1;
  const { country, state, postal_code } = shipping;
  if (category) {
    const tax = await Tax.findOne({ category });
    const taxRate = getTaxRateFromJson(
      tax?.taxJson,
      country,
      state,
      postal_code
    );
    if (taxRate !== null) return taxRate;
  }
  const tax = await Tax.findOne({ category: null });
  const taxRate = getTaxRateFromJson(tax?.taxJson, country, state, postal_code);
  if (taxRate !== null) return taxRate;

  if (SalesTax.hasStateSalesTax(country, state)) {
    const res = await SalesTax.getSalesTax(country, state);
    return res.rate || 0;
  }
  if (SalesTax.hasSalesTax(country)) {
    const res = await SalesTax.getSalesTax(country);
    return res.rate || 0;
  }
  return 0;
};

exports.checkShippingInfo = (shipping) => {
  if (!shipping) return false;
  if (!shipping.country) return false;
  if (shipping.country === "CA" || shipping.country === "US") {
    if (!shipping.state) return false;
  }
  return true;
};

exports.sendPushNotification = (token, alert) => {
  return new Promise((resolve, reject) => {
    const notification = new apn.Notification({
      alert,
    });
    notification.topic = "com.ollacart.share.OllaCart";
    // notification.payload = {
    //   url,
    // };

    apnProvider
      .send(notification, token)
      .then((response) => {
        console.log(response);
        if (response?.failed?.length) {
          console.log(
            "sendPushNotification failed response",
            response?.failed[0].response
          );
        }
        resolve(response);
      })
      .catch((error) => {
        console.error("sendPushNotification error", error);
        reject(error);
      });

    apnProvider.shutdown();
  });
};
