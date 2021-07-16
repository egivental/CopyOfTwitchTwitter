const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "LivestreamComment",
  new mongoose.Schema({
    livestream_user: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: Number, required: true },
    message: { type: String, required: true },
  })
);
