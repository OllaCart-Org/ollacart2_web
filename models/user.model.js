const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      // required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: 'user'
    },
    ce_id: {
      type: String,
      default: ''
    },
    secure: {
      type: Number,
      default: 0
    },
    secure_identity: {
      type: String,
      default: ''
    },
    last_verified: {
      type: String,
      default: ''
    },
    shipping: {
      address1: String,
      address2: String,
      country: String,
      city: String,
      zip_code: String
    },
    enable_shopping_recommendation: {
      type: Boolean,
      default: false
    },
    enable_tax: {
      type: Boolean,
      default: false
    },
    enable_promo_code: {
      type: Boolean,
      default: false
    },
    following: [{
      type: ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
