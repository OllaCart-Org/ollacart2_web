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
    following: [{
      type: ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
