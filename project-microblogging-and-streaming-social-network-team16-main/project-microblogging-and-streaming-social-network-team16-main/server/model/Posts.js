const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Post",
  new mongoose.Schema({
    user: { type: String, required: true },
    photo: { type: String, required: false },
    date: { type: Number, required: true },
    message: { type: String, required: true },
    attachment: { type: String, required: false },
    attachment_type: { type: String, required: false },
    comments: { type: Array, required: false },
    analytics: { type: Object, required: false },
  })
);
