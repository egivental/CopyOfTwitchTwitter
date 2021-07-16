const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Blocks",
  new mongoose.Schema({
    user: String,
    blocked_user: String,
  })
);

// special case for blocks: we don't need this in other model files
module.exports.schema.index({ user: 1, blocked_user: 1 }, { unique: true });
