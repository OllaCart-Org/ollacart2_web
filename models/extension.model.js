const mongoose = require('mongoose');

const extensionSchema = new mongoose.Schema(
  {
    ce_id: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Extension', extensionSchema);
