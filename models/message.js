const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    email: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    message: {
      type: String,
      maxlength: 2000,
    },
    target: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    read: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
