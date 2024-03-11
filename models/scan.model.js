const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const scanSchema = new mongoose.Schema(
  {
    url: String,
    push_token: String,
    jsonifyResultId: String,
    text: String,
    user: {
      type: ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scan", scanSchema);
