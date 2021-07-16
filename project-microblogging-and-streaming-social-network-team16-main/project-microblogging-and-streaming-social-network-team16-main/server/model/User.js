const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    registration_date: { type: Number, required: true },
    photo: { type: String, required: false },
    failed_login_attempts: { type: Number, required: true },
    last_failed_login_attempt_date: { type: Number, required: true },
    is_livestreaming: { type: {}, required: true }, // special case: only is_livestreaming will have the type {}, nothing else should
    livestream_date: { type: Number, required: true },
    deactivated: { type: Boolean, required: true },
  })
);
