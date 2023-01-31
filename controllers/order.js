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





exports.updateOrder = async (type, data) => {
  const order = await Order.findOne({ clientSecret: data.client_secret });
  if (!order) return;

  order.status = type;

  if (type === 'succeeded') {
    const address = data.shipping.address;

    order.totalReceived = data.amount_received / 100;
    order.shipping = {
      city: address.city,
      country: address.country,
      line1: address.line1,
      line2: address.line2,
      postalCode: address.postal_code,
      state: address.state,
      name: data.shipping.name,
      phone: data.shipping.phone
    }
  }

  await order.save();  
}