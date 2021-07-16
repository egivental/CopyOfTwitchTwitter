const user = require("./user.js");
const media = require("./media.js");
const post = require("./post.js");
const message = require("./message.js");
const livestreams = require("./livestreams.js");

module.exports = (app) => {
  user(app);
  media(app);
  post(app);
  message(app);
  livestreams(app);
};
