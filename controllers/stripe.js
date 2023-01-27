const Product = require('../models/product');

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
        name: 'Stripe Fee',
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