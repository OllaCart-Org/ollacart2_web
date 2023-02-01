const User = require('./user.controller');
const Product = require('./product.controller');

exports.getAnalytics = async (req, res) => {
  const userCount = await User.getUserCount();
  const productCount = await Product.getProductCount();
  const sharedProductCount = await Product.getProductCount({ shared: 1 });
  const purchasedProductCount = await Product.getProductCount({ purchased: 1 });
  const domains = await Product.getDomains();
  const productNames = await Product.getProductNames();

  res.send({
    success: true,
    analytics: {
      userCount,
      productCount,
      sharedProductCount,
      purchasedProductCount
    },
    domains,
    productNames
  })
};
