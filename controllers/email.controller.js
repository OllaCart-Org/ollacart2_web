const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');
const path = require('path');
nunjucks.configure(path.join(__dirname, "../templates"), { autoescape: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'support@ollacart.com',
    pass: 'mhsaqafoiayfwplw'
  }
});

const readTemplate = (type, params) => {
  const content = nunjucks.render(`${type}.template.html`, params);
  return content;
}

exports.sendSingleShareEmail = (product, mailTo) => {
  var mailOptions = {
    from: 'support@ollacart.com',
    to: mailTo,
    subject: 'Direct Share',
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