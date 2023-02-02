const Order = require('../models/order.model');

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





exports.getOrders = async (req, res) => {
  const { filter } = req.body;

  const orders = await Order.find({ status: 'succeeded' })
    .sort([['createdAt', 'desc']])
    .skip((filter.page - 1) * filter.countPerPage)
    .limit(filter.countPerPage)
    .populate('user')
    .populate('products.product')
    .exec();
  res.send({ success: true, orders, total: await this.getOrderCount() });
}

exports.getOrderCount = async (filter = {}) => {
  const count = await Order.countDocuments(filter) || 0;
  return count;
}




exports.updateOrder = async (type, data) => {
  const order = await Order.findOne({ clientSecret: data.client_secret });
  if (!order) return;

  order.status = type;

  if (type === 'succeeded') {
    order.totalReceived = data.amount_received / 100;
    order.name = data.shipping.name;
    order.phone = data.shipping.phone;
    order.address = JSON.stringify(data.shipping.address);
  }

  await order.save();  
}