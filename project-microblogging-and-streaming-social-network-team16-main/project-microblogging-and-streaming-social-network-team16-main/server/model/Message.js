const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    date: { type: Number, required: true },
    from_user: { type: String, required: true },
    to_user: { type: String, required: true },
    read_date: { type: Number, required: true },
    delivered_date: { type: Number, required: true },
    message: { type: String, required: true },
    attachment: { type: String, required: false },
    attachment_mime_type: { type: String, required: false },
  })
);
