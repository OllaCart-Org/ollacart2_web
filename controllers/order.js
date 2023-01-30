const Order = require('../models/order');

exports.getProductsByClientSecret = async (req, res) => {
  const { clientSecret } = req.body;

  const order = await Order.findOne({ clientSecret });
  if(!order) return res.status(400).send({ error: 'fetch failed' });
  res.send({
    totalPrice: order.totalPrice,
    totalFee: order.totalFee,
    products: order.products
  })
};