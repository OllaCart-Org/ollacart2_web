const { default: Stripe } = require('stripe');
const Order = require('../models/order.model');

exports.getProductsByClientSecret = async (req, res) => {
  const { clientSecret } = req.body;

  const order = await Order.findOne({ clientSecret });
  if(!order) return res.status(400).send({ error: 'fetch failed' });
  res.send({
    totalPrice: order.totalPrice,
    totalFee: order.totalFee,
    products: order.products,
    receiptUrl: order.receiptUrl
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
  res.send({ success: true, orders, total: await this.getOrderCount({ status: 'succeeded' }) });
}

exports.getOrderCount = async (filter = {}) => {
  const count = await Order.countDocuments(filter) || 0;
  return count;
}

exports.updateOrderStatusByProduct = async (req, res) => {
  const { status, orderId, productIdx } = req.body.detail;

  if (status < 0 || status > 3) return res.status(400).json({ error: 'Invalid Status' });

  const order = await Order.findOne({ _id: orderId }).populate('user').populate('products.product').exec();
  if (!order) return res.status(400).json({error: 'Not found Order'});

  if (productIdx < 0 || productIdx >= order.products.length) return res.status(400).json({error: 'Not found Product'});

  // [TO DO] Secure this section.
  order.products[productIdx].orderStatus = status;
  const minStatus = Math.min(...order.products.map(p => p.orderStatus));

  order.orderStatus = minStatus;

  await order.save();
  res.json({ order });
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

    const charge = await stripe.charges.retrieve(data.latest_charge);
    order.receiptUrl = charge.receipt_url;
  }

  await order.save();  
}