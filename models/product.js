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
    price: {
      type: Number,
      trim: true,
      maxlength: 32,
    },
    // category: {
    //   type: ObjectId,
    //   ref: 'Category',
    //   required: true,
    // },
    shared: {
      type: Number,
      default: 0,
    },
    purchased: {
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
      default: 0
    },
    user: {
      type: ObjectId,
      ref: 'User',
      // required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
