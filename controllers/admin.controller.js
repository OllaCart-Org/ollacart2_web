const User = require('./user.controller');
const Product = require('./product.controller');
const Order = require('./order.controller');

exports.getAnalytics = async (req, res) => {
  const userCount = await User.getUserCount();
  const productCount = await Product.getProductCount();
  const sharedProductCount = await Product.getProductCount({ shared: 1 });
  const purchasedProductCount = await Product.getProductCount({ purchased: 1 });
  const domains = await Product.getDomains();
  const productNames = await Product.getProductNames();
  const ordersNotPlacedSummary = await Order.getOrdersSummary({ orderStatus: 0 });
  const productsNotPlacedSummary = await Order.getOrderProductsSummaryByOrderStatus(0);

  res.send({
    success: true,
    analytics: {
      userCount,
      productCount,
      sharedProductCount,
      purchasedProductCount,
      ordersNotPlacedSummary,
      productsNotPlacedSummary,
    },
    domains,
    productNames
  })
};
