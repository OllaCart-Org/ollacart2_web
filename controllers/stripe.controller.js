const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const orderController = require("./order.controller");
const utils = require("../helpers/utils");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createProductPrice = async (productInfo, priceInfo) => {
  try {
    const product = await stripe.products.create(productInfo);
    const price = await stripe.prices.create({
      ...priceInfo,
      product: product.id,
    });

    return price.id;
  } catch (ex) {
    console.log("creatFee error", ex);
    return null;
  }
};

const getCustomerId = async (user) => {
  if (!user || !user.email) return null;
  if (user.checkout?.customerId) {
    const customer = await stripe.customers.retrieve(user.checkout.customerId);
    if (!customer) user.checkout.customerId = null;
  }
  if (!user.checkout?.customerId) {
    const customer = await stripe.customers.create({ email: user.email });
    user.checkout.customerId = customer.id;
    await user.save();
  }
  return user.checkout.customerId;
};

exports.fetchPurchaseLink = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send({ error: "not signin" });

  const products = await Product.find({ user: user._id, purchased: 1 });
  const line_items = [];
  let total_price = 0;

  //Add products and prices
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (!p.name || !p.url || !p.price || p.price < 0.5) {
      console.log("create purchase product invalid product", p);
      continue;
    }

    const unit_amount = Math.ceil(p.price * 100);
    const price_id = await createProductPrice(
      {
        name: p.name,
        images: [p.photo.normal || p.photo.url],
        url: p.url,
      },
      {
        unit_amount: unit_amount,
        currency: "usd",
      }
    );

    if (!price_id) return res.status(400).send({ error: "failed" });

    line_items.push({
      price: price_id,
      quantity: 1,
    });
    total_price += unit_amount + process.env.SHIPPING_COST * 100;
  }

  if (!line_items) return res.send({ error: "No items" });

  // Add shipping cost
  line_items.unshift({
    price: process.env.STRIPE_SHIPPING_PRICE_ID,
    quantity: line_items.length,
  });

  //Add Stripe Fee
  const total_fee = (total_price + 30) / (1 - 0.029) - total_price;
  try {
    const price_id = await createProductPrice(
      {
        name: "Processing Fee",
        description: "Stripe Fee (2.9% + 30¢)",
      },
      {
        unit_amount: Math.ceil(total_fee),
        currency: "usd",
      }
    );
    if (!price_id) return res.status(400).send({ error: "failed" });

    line_items.unshift({
      price: price_id,
      quantity: 1,
    });
  } catch (ex) {
    console.log("creatFee error", ex);
    return res.status(400).send({ error: "failed" });
  }

  //Create payment link
  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items,
      // automatic_tax: {
      //   enabled: true
      // },
      billing_address_collection: "required",
    });

    if (!paymentLink || !paymentLink.url)
      return res.send({ error: "Purchase failed" });

    res.send({ url: paymentLink.url });
  } catch (ex) {
    console.log("create payment link failed", ex);
    return res.send({ error: "Purchase failed" });
  }
};

exports.createPaymentIntent = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).send({ error: "not signin" });
  if (!utils.checkShippingInfo(user.shipping))
    return res.status(400).send({ error: "shipping" });

  try {
    let products = await Product.find({ user: user._id, purchased: 1 });
    products = products.filter(
      (item) => item.name && item.url && item.price && item.price >= 0.5
    );

    const order_products = [];

    let total_price = 0;
    let taxPrice = 0,
      anonymousPrice = 0,
      shippingPrice = 0,
      itemsPrice = 0;
    for (let i = 0; i < products.length; i++) {
      const itm = products[i];
      const order_product = {
        product: itm._id,
        photo: itm.photo.normal || itm.photo.url,
        name: itm.name,
        price: Math.ceil(itm.price * 100) / 100,
        url: itm.url,
        original_url: itm.original_url,
        color: itm.color,
        size: itm.size,
        domain: itm.domain,
        taxPrice: 0,
        anonymousPrice: 0,
        shippingPrice: parseFloat(process.env.SHIPPING_COST || 14),
      };

      // tax calculate
      const taxRate = await utils.getTaxRate(user.shipping, itm.category);
      order_product.taxRate = taxRate;
      if (taxRate >= 0) {
        order_product.taxPrice =
          Math.ceil(order_product.price * taxRate * 100) / 100;
      }

      // anonymous shopping
      if (user.status.anonymous_shopping) {
        order_product.anonymousPrice = Math.ceil(order_product.price) / 100;
      }

      order_products.push(order_product);

      taxPrice += order_product.taxPrice;
      anonymousPrice += order_product.anonymousPrice;
      shippingPrice += order_product.shippingPrice;
      itemsPrice += order_product.price;
    }

    if (!products.length)
      return res.status(400).json({ error: "No items in purchase cart" });
    total_price = Math.ceil(
      (itemsPrice + taxPrice + anonymousPrice + shippingPrice) * 100
    );

    // const total_fee = Math.ceil((total_price + 30) / (1 - 0.029) - total_price);
    const total_fee = 0;
    total_price += total_fee;

    const customerId = await getCustomerId(user);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total_price,
      currency: "usd",
      customer: customerId,
      setup_future_usage: "off_session",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "Payment for new Order",
      metadata: {
        type: "order",
      },
    });

    const order = new Order({
      user: user._id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      totalPrice: total_price / 100,
      totalFee: total_fee / 100,
      products: order_products,
      status: "created",
      anonymous_shopping: user.status.anonymous_shopping,
      itemsPrice,
      anonymousPrice,
      taxPrice,
      shippingPrice,
    });

    const order_res = await order.save();
    if (!order_res) {
      console.log("create order failed");
      return res.send({ error: "Create Order failed" });
    }

    res.send({
      clientSecret: paymentIntent.client_secret,
      products,
      total_price,
      total_fee,
    });
  } catch (ex) {
    console.log("create payment link failed", ex);
    return res.send({ error: "Purchase failed" });
  }
};

exports.createAnonymousUsernamePaymentIntent = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(400).json({ error: "Not signed in" });

  const customerId = await getCustomerId(user);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "usd",
    customer: customerId,
    setup_future_usage: "off_session",
    automatic_payment_methods: {
      enabled: true,
    },
    description: "Payment for Anonymous Username",
    metadata: {
      type: "anonymous_username",
    },
  });

  res.send({ clientSecret: paymentIntent.client_secret });
};

exports.receiveWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event, data;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("stripe webhook", event.type, event);
    data = event.data.object;

    if (data.metadata.type === "anonymous_username") {
      if (event.type !== "payment_intent.succeeded") return res.send();
      const customer = data.customer;
      if (!customer) return res.send();
      const user = await User.findOne({ "checkout.customerId": customer });
      if (!user) return res.send();
      user.checkout.anonymous_username = true;
      user.status.anonymous_username = true;
      await user.save();
      return res.send();
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("payment successed");
        orderController.updateOrder("succeeded", data);
        break;
      case "payment_intent.canceled":
      case "payment_intent.payment_failed":
        console.log("payment failed");
        orderController.updateOrder("failed", data);
        break;
      default:
        console.log("Unknown Event", event.type);
        break;
    }

    res.send();
  } catch (err) {
    console.log("Webhook Error", err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};
