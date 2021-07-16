const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Comment",
  new mongoose.Schema({
    post_id: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: Number, required: true },
    message: { type: String, required: true },
  })
);
