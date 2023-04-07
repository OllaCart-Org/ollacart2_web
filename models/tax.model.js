const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const taxSchema = new mongoose.Schema(
  {
    category: {
      type: ObjectId,
      ref: 'Category'
    },
    taxJson: {},
    user: {
      type: ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tax', taxSchema);
