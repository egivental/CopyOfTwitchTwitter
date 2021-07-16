const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("./mongo/index.js");
const User = require("./model/User.js");
const api = require("./api");

module.exports = (app) => {
  // Configure express middleware settings
  app.use(express.json({ limit: "20mb" }));
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: true }));
  app.use(
    session({
      secret:
        "d30de34ac88e6a4c6ce263932adeacac0d3ebbf72fb7872b54aa22b393e76bfe",
      cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  ); // SHA256 Random Token

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username, deactivated: false }, async (err, user) => {
        if (err) {
          return done(null, false);
        }
        if (!user) {
          return done(null, false);
        }
        if (
          user.failed_login_attempts > 10 &&
          Date.now() - user.last_failed_login_attempt_date < 5 * 60 * 1000
        ) {
          return done(
            new Error(
              "You have made too many failed login attempts, try again in 5 minutes."
            ),
            false
          );
        }
        if (user.failed_login_attempts > 10) {
          user.failed_login_attempts = 0;
          user.save();
        }
        if (!(await bcrypt.compare(password, user.password))) {
          user.failed_login_attempts += 1;
          user.last_failed_login_attempt_date = Date.now();
          user.save();
          return done(null, false);
        }

        return done(null, user);
      });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // Add a healthcheck endpoint for testing purposes
  const healthcheckRoutes = ["/healthcheck"];
  if (process.env.NODE_ENV !== "production") {
    healthcheckRoutes.push("/");
  }
  app.get(healthcheckRoutes, (req, res) => {
    res.send("Hello World! The server is fine and healthy.");
  });

  // Configure API server routes
  api(app);

  // Configure static serve routes for production mode
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "build")));
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "build", "index.html"));
    });
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "build", "index.html"));
    });
  }
};
