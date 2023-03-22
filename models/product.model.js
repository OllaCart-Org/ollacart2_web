const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 320,
    },
    description: {
      type: String,
      // required: true,
      maxlength: 2000,
    },
    keywords: [{ type: String }],
    price: {
      type: Number,
      trim: true,
      maxlength: 32,
    },
    color: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    shared: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0
    },
    purchasedStatus: {
      type: Number,
      default: 0
    },
    photo: {
      type: String,
      default: ''
    },
    photos: [{
      type: String,
      default: ''
    }],
    url: {
      type: String,
      default: ''
    },
    original_url: {
      type: String,
      default: ''
    },
    domain: {
      type: String,
      default: ''
    },
    ce_id: {
      type: String,
      default: ''
    },
    sequence: {
      type: Number,
      default: Date.now()
    },
    user: {
      type: ObjectId,
      ref: 'User',
    },
    forkId: {
      type: ObjectId,
      ref: 'Product'
    },
    forkedIds: [{
      type: ObjectId,
      ref: 'Product'
    }],
    likes: [{
      type: ObjectId,
      ref: 'User',
    }],
    dislikes: [{
      type: ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
