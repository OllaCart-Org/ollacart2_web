const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const scanSchema = new mongoose.Schema(
  {
    url: String,
    push_token: String,
    jsonifyResultId: String,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scan", scanSchema);
