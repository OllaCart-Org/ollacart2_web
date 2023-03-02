const Product = require('../models/product.model');
const Order = require('../models/order.model');
const orderController = require('./order.controller');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const createProductPrice = async (productInfo, priceInfo) => {
  try {
    const product = await stripe.products.create(productInfo);
    const price = await stripe.prices.create({ ...priceInfo, product: product.id });

    return price.id
  } catch(ex) {
    console.log('creatFee error', ex);
    return null;
  }
}


exports.fetchPurchaseLink = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send({ error: 'not signin' });
  
  const products = await Product.find({ user: user._id, purchased: 1 });
  const line_items = [];
  let total_price = 0;

  //Add products and prices
  for (let i = 0; i < products.length; i ++) {
    const p = products[i];
    if (!p.name || !p.url || !p.price || p.price < 0.5) {
      console.log('create purchase product invalid product', p);
      continue;
    }

    const unit_amount = Math.ceil(p.price * 100);
    const price_id = await createProductPrice({
        name: p.name,
        images: [ p.photo ],
        url: p.url
      }, {
        unit_amount: unit_amount,
        currency: 'usd',
      });

    if (!price_id) return res.status(400).send({ error: 'failed' });

    line_items.push({
      price: price_id,
      quantity: 1
    })
    total_price += unit_amount + process.env.SHIPPING_COST * 100;
  }

  if (!line_items) return res.send({ error: 'No items' });

  // Add shipping cost
  line_items.unshift({
    price: process.env.STRIPE_SHIPPING_PRICE_ID,
    quantity: line_items.length
  })

  //Add Stripe Fee
  const total_fee = (total_price + 30) / (1 - 0.029) - total_price;
  try {
    const price_id = await createProductPrice({
        name: 'Processing Fee',
        description: 'Stripe Fee (2.9% + 30¢)'
      }, {
        unit_amount: Math.ceil(total_fee),
        currency: 'usd',
      });
    if (!price_id) return res.status(400).send({ error: 'failed' });

    line_items.unshift({
      price: price_id,
      quantity: 1
    });
  } catch(ex) {
    console.log('creatFee error', ex);
    return res.status(400).send({ error: 'failed' });
  }

  //Create payment link
  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items,
      // automatic_tax: {
      //   enabled: true
      // },
      billing_address_collection: 'required'
    });

    if (!paymentLink || !paymentLink.url) return res.send({ error: 'Purchase failed' });

    res.send({ url: paymentLink.url });
  } catch (ex) {
    console.log('create payment link failed', ex);
    return res.send({ error: 'Purchase failed' });
  }
}

exports.createPaymentIntent = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send({ error: 'not signin' });

  try {
    let products = await Product.find({ user: user._id, purchased: 1 });
    products = products.filter(item => item.name && item.url && item.price && item.price >= 0.5);

    let total_price = 0;
    for (let i = 0; i < products.length; i ++) {
      total_price += Math.ceil(products[i].price * 100);
    }
    if (!products.length) return res.status(400).json({ error: 'No items in purchase cart' });
    total_price += process.env.SHIPPING_COST * 100 * products.length;
    // total_price = Math.ceil(total_price * 100);

    const total_fee = Math.ceil((total_price + 30) / (1 - 0.029) - total_price);
    total_price += total_fee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_price,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const order = new Order({
      user: user._id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalPrice: total_price / 100,
      totalFee: total_fee / 100,
      products: products.map(itm => ({
        product: itm._id,
        photo: itm.photo,
        name: itm.name,
        price: Math.ceil(itm.price * 100) / 100,
        url: itm.url,
        original_url: itm.original_url,
        color: itm.color,
        size: itm.size,
        domain: itm.domain
      })),
      status: 'created'
    });

    const order_res = await order.save();
    if (!order_res) {
      console.log('create order failed');
      return res.send({ error: 'Create Order failed' });
    }

    res.send({
      clientSecret: paymentIntent.client_secret,
      products,
      total_price,
      total_fee
    });
  } catch (ex) {
    console.log('create payment link failed', ex);
    return res.send({ error: 'Purchase failed' });
  }
}

exports.receiveWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event, data;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('stripe webhook', event.type, event);
    data = event.data.object;
    
    switch(event.type) {
      case 'payment_intent.succeeded':
        console.log('payment successed');
        orderController.updateOrder('succeeded', data);
        break;
      case 'payment_intent.canceled':
      case 'payment_intent.payment_failed':
        console.log('payment failed');
        orderController.updateOrder('failed', data);
        break;
      default:
        console.log('Unknown Event', event.type);
        break;
    }
  
    res.send();

  } catch (err) {
    console.log('Webhook Error', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
}