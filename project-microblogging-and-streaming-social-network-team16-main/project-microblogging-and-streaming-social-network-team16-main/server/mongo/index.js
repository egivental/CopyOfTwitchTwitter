const mongoose = require("mongoose");

// Connect to the database
let dbName = null;
if (typeof jest !== "undefined") {
  dbName = "cis557_test";
} else if (process.env.NODE_ENV === "production") {
  dbName = "cis557";
} else {
  dbName = "cis557_dev";
}
mongoose.set("useCreateIndex", true);
mongoose.connect(
  `mongodb+srv://admin:cis557abe@557finalproject.rclro.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

module.exports = mongoose;
