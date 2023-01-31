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
    products: [{
      product: {
        type: ObjectId,
        ref: 'Product'
      },
      photo: String,
      name: String,
      price: Number
    }],
    status: {
      type: String,
      default: 'created'
    },
    shipping: {
      city: String,
      country: String,
      line1: String,
      line2: String,
      postalCode: String,
      state: String,
      name: String,
      phone: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', categorySchema);
