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
    shipping_status: {
      type: String,
      default: 'initial'
    },
    refund_status: {
      type: String,
      default: 'initial'
    },
    products: [{
      product: {
        type: ObjectId,
        ref: 'Product'
      },
      shipping_status: {
        type: String,
        default: 'initial'
      },
      refund_status: {
        type: String,
        default: 'initial'
      },
      photo: String,
      name: String,
      price: Number
    }],
    status: {
      type: String,
      default: 'created'
    },
    address: {
      type: String,
      default: '""'
    },
    name: String,
    phone: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', categorySchema);
