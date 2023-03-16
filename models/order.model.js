const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
    },
    clientSecret: {
      type: String,
      required: true
    },
    paymentIntentId: {
      type: String,
      required: true
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    totalFee: {
      type: Number,
      default: 0
    },
    totalReceived: {
      type: Number,
      default: 0
    },
    orderStatus: {
      type: Number,
      default: 0
    },
    refund_status: {
      type: String,
      default: 'initial'
    },
    receiptUrl: {
      type: String,
      default: ''
    },
    products: [{
      product: {
        type: ObjectId,
        ref: 'Product'
      },
      orderStatus: { // 0: initial,  1: Order Placed, 2: Shipped, 3: Order Closed
        type: Number,
        default: 0
      },
      refund_status: {
        type: String,
        default: 'initial'
      },
      shippingNote: String,
      photo: String,
      name: String,
      price: Number,
      url: String,
      domain: String,
      original_url: String,
      color: String,
      size: String
    }],
    status: {
      type: String,
      default: 'created'
    },
    shipping: {
      name: String,
      phone: String,
      country: String,
      city: String,
      state: String,
      postal_code: String,
      line1: String,
      line2: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', categorySchema);
