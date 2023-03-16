const Order = require('../models/order.model');
const utils = require('../helpers/utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({ error: 'Order not found' });
      }
      req.order = order;
      next();
    });
};

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

exports.getOrderedProducts = async (req, res) => {
  const user = req.user;

  const orders = await Order.find({ user: user._id, status: 'succeeded' }).sort([['createdAt', 'desc']]).populate('products.product').exec();
  if(!orders) return res.status(400).send({ error: 'fetch failed' });

  const products = [];
  for (let i = 0; i < orders.length; i ++) products.push(...orders[i].products);

  res.send({ products });
}

exports.getOrdersByUser = async (req, res) => {
  const user = req.user;
  const orders = await Order.find({ user: user._id, status: 'succeeded' }).sort([['createdAt', 'desc']]);

  res.send({ orders });
}




exports.getOrders = async (req, res) => {
  const { pagination } = req.body;

  const orders = await Order.find({ status: 'succeeded' })
    .sort([['createdAt', 'desc']])
    .skip((pagination.page - 1) * pagination.countPerPage)
    .limit(pagination.countPerPage)
    .populate('user')
    .populate('products.product')
    .exec();
  res.send({ success: true, orders, total: await this.getOrderCount({ status: 'succeeded' }) });
}

exports.updateOrderStatusByProduct = async (req, res) => {
  const { status, orderId, productIdx } = req.body.detail;

  if (status < 0 || status > 3) return res.status(400).json({ error: 'Invalid Status' });

  const order = await Order.findOne({ _id: orderId }).populate('user').populate('products.product').exec();
  if (!order) return res.status(400).json({error: 'Not found Order'});

  if (productIdx < 0 || productIdx >= order.products.length) return res.status(400).json({error: 'Not found Product'});

  // [TO DO] Secure this section.
  const product = order.products[productIdx];
  product.orderStatus = status;
  const minStatus = Math.min(...order.products.map(p => p.orderStatus));
  
  order.orderStatus = minStatus;
  
  await order.save();

  utils.sendOrderStatusMail(order.user.email, product.name, product.price, status, false);
  utils.sendOrderStatusMail(order.user.email, product.name, product.price, status, true);
  res.json({ order });
}

exports.updateShippingNote = async (req, res) => {
  const { idx, shippingNote } = req.body;
  const order = req.order;
  if (!order) return res.status(400).send('Order not found');

  order.products[idx].shippingNote = shippingNote || '';
  const response = await order.save();

  res.send({ order: response });
  
  await order.populate('user').exec();
  utils.sendShippingNoteMail(order.user.email, order.products[idx].name, shippingNote);
}

exports.getOrderCount = async (filter = {}) => {
  const count = await Order.countDocuments(filter) || 0;
  return count;
}

exports.getOrdersSummary = async (filter = {}) => {
  const summary = await Order.aggregate([{
    $match: { ...filter, status: 'succeeded' }
  }, {
    $group: { _id: '', count: {$sum: 1}, price: {$sum: '$totalPrice'}} 
  }]);
  return summary[0];
}

exports.getOrderProductsSummaryByOrderStatus = async (orderStatus) => {
  const summary = await Order.aggregate([{
    $match: { status: 'succeeded' }
  }, {
    $unwind: '$products'
  }, {
    $match: { 'products.orderStatus': orderStatus }
  }, {
    $group: { _id: '', count: {$sum: 1}, price: {$sum: '$products.price'}} 
  }]);
  return summary[0];
}




exports.updateOrder = async (type, data) => {
  const order = await Order.findOne({ clientSecret: data.client_secret }).populate('user').exec();
  if (!order) return;

  order.status = type;

  if (type === 'succeeded') {
    order.totalReceived = data.amount_received / 100;
    order.shipping = {
      name: data.shipping.name,
      phone: data.shipping.phone,
      ...data.shipping.address
    };

    const charge = await stripe.charges.retrieve(data.latest_charge);
    order.receiptUrl = charge.receipt_url;

    utils.sendNewOrderMail(order);
  }

  await order.save();  
}