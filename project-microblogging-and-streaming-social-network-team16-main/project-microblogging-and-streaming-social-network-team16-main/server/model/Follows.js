const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Follows",
  new mongoose.Schema({
    followee: String,
    follower: String,
  })
);

// special case for follows: we don't need this in other model files
module.exports.schema.index({ followee: 1, follower: 1 }, { unique: true });
