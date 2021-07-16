const express = require("express");
const main = require("./main.js");

const app = express();

// Set the port the Express server will run on
let port = 3001;
if (process.env.NODE_ENV === "production") {
  port = 80;
}
if (
  process.env.NODE_ENV === "production" &&
  typeof process.env.PORT !== "undefined"
) {
  port = parseInt(process.env.PORT, 10);
}

// Configure the app
main(app);

// Start the server
app.listen(port, () => {
  // We want to show that the server is running in this particular case.
  // So we'll disable the no-console rule, just for this exception.
  // eslint-disable-next-line no-console
  console.log(`API server listening at http://localhost:${port}`);
});
