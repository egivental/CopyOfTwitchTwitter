const mongoose = require("../mongo/index.js");

module.exports = mongoose.model(
  "Media",
  new mongoose.Schema({
    // id: String, // MongoDB automatically creates the ID for objects, you can access it at documentVariable.id
    mime_type: String,
    data: String,
  })
);
