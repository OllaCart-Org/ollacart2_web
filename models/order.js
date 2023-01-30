const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
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
    products: [{
      _id: ObjectId,
      photo: String,
      name: String,
      price: Number
    }],
    status: {
      type: String,
      default: 'created'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', categorySchema);
