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
        <p>Congrats on the first step towards your new online shopping experience. As we continue to develop the capabilities of OllaCart, download and use our <a href="https://chrome.google.com/webstore">Chrome Extension</a> to select items from any online shopping website and add them to your OllaCart. It is as easy as selecting the extension logo, selecting the item, and selecting the extension logo again.<br>
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