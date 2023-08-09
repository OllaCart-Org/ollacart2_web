const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const investSchema = new mongoose.Schema(
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
    company: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    comment: {
      type: String,
      maxlength: 2000,
    },
    read: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invest', investSchema);
