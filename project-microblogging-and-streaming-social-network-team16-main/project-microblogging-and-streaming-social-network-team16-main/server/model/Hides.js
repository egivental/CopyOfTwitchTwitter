const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Hides",
  new mongoose.Schema({
    post_id: { type: String, required: true },
    user: { type: String, required: true },
  })
);
